import { z } from "zod";

import {
  ApiResponse,
  AuthorData,
  authorDataSchema,
  GetUserParams,
  ItemForServer,
  LearnedItem,
  RegistrationData,
  SupportedLanguage,
  UpdateUser,
  User,
} from "@/lib/contracts";
import {
  objectIdSchema,
  SensitiveUser,
  sensitiveUserSchema,
} from "@/lib/schemas";
import { defaultSRSettings } from "@/lib/siteSettings";
import {
  buildNewUser,
  isOAuthProvider,
  safeDbRead,
  safeDbWrite,
} from "@/lib/utils";
import Users from "@/models/user.schema";
import { Types, UpdateResult } from "mongoose";

export async function createUser(
  registrationData: RegistrationData
): Promise<ApiResponse<SensitiveUser>> {
  const newUser = await buildNewUser(registrationData);

  const extendedSensitiveUserSchema = sensitiveUserSchema.extend({
    _id: objectIdSchema,
  });

  return await safeDbWrite({
    input: newUser,
    dbWriteQuery: (validatedUser) => Users.create(validatedUser),
    schemaForValidation: extendedSensitiveUserSchema,
    errorMessage: `Failed to create user ${newUser.username}`,
  });
}

export async function updateUser(
  userData: UpdateUser
): Promise<ApiResponse<UpdateResult>> {
  const { id, ...updateFields } = userData;
  return await safeDbWrite({
    input: updateFields,
    dbWriteQuery: () =>
      Users.updateOne({ id }, updateFields, {
        runValidators: true,
      }),
    schemaForValidation: sensitiveUserSchema.partial(),
    errorMessage: `Failed to update user with user id ${id}`,
  });
}

export async function getUser({
  method,
  query,
}: GetUserParams): Promise<ApiResponse<SensitiveUser>> {
  const dbQuery = isOAuthProvider(method)
    ? { oauth: { [method]: query } }
    : { [method]: query };

  return await safeDbRead({
    dbReadQuery: () =>
      Users.findOne(dbQuery)
        .populate({
          path: "recentDictionarySearches",
          select: "name partOfSpeech IPA gender language definition slug",
        })
        .lean(),
    schemaForValidation: sensitiveUserSchema,
  });
}

export async function getAuthors(
  userIds: string[]
): Promise<ApiResponse<AuthorData[]>> {
  return await safeDbRead({
    dbReadQuery: () =>
      Users.find(
        { _id: { $in: userIds } },
        { username: 1, usernameSlug: 1, _id: 0 }
      ).lean(),
    schemaForValidation: z.array(authorDataSchema),
    errorMessage: "Failed to fetch author data",
  });
}

export async function isTaken(
  field: "username" | "email" | "usernameSlug",
  value: string
): Promise<boolean> {
  const exists = await Users.exists({
    [field]: { $regex: `^${value}$`, $options: "i" },
  });
  return !!exists;
}

export async function updateReviewedItems(
  items: ItemForServer[],
  userId: string,
  language: SupportedLanguage
) {
  try {
    const allPassedItemIds = items.map((item) => item.id);
    const userResponse = await getUser({ method: "_id", query: userId });
    if (!userResponse.success) throw new Error("Could not find user");

    const user = userResponse.data;
    const allLearnedItems = user?.learnedItems?.[language] || [];
    const userSRSettings =
      user?.customSRSettings?.[language] || defaultSRSettings;

    const allItemsWeNeedToUpdate = allLearnedItems.filter((learnedItem) =>
      allPassedItemIds.some((passedId) => learnedItem.id === passedId)
    );

    const passedItemsAndFetchedItems = allItemsWeNeedToUpdate.map(
      (fetchedItem) => {
        return {
          fetchedItem,
          passedItem: items.find((item) => item.id === fetchedItem.id),
        };
      }
    );

    passedItemsAndFetchedItems.forEach(async (itemPair) => {
      if (!itemPair || !itemPair.passedItem)
        throw new Error("This item was not reviewed, please report this");
      await Users.updateOne<User>(
        { id: userId },
        {
          $pull: {
            [`learnedItems.${language}`]: {
              id: itemPair.fetchedItem.id,
            },
          },
        }
      );

      const newLevelForItem = itemPair.passedItem.increaseLevel
        ? Math.min(itemPair.fetchedItem.level + 1, 10)
        : 1;

      await Users.updateOne<User>(
        { id: userId },
        {
          $push: {
            [`learnedItems.${language}`]: {
              id: itemPair.passedItem?.id,
              level: newLevelForItem,
              nextReview:
                Date.now() +
                userSRSettings.reviewTimes[
                  newLevelForItem as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
                ],
            },
          },
        }
      );
    });
    return true;
  } catch (err) {
    console.error(
      `Error updating reviewed items. Received these ${JSON.stringify(
        items
      )}, user ${userId}, language ${language}. ${err}`
    );
  }
}

export async function addNewlyLearnedItems(
  items: ItemForServer[],
  userId: string,
  language: SupportedLanguage
) {
  try {
    const user = await Users.findOne({ id: userId });
    if (!user) throw new Error("User not found");
    const learnedItemsForLanguage = user.learnedItems?.[language] || [];
    const sRSettings = user.customSRSettings?.[language] || defaultSRSettings;
    const newItemIds = items.map((item) => new Types.ObjectId(item.id));
    const filteredItems = learnedItemsForLanguage.filter(
      (learnedItem: LearnedItem) =>
        !newItemIds.some(
          (newItemId) => new Types.ObjectId(learnedItem.id) === newItemId
        )
    );
    const newLearnedItems = items.map((item) => ({
      id: item.id,
      level: 1,
      nextReview: Date.now() + sRSettings.reviewTimes[1],
    }));
    const updatedItems = [...filteredItems, ...newLearnedItems];

    return await Users.updateOne<User>(
      { id: userId },
      {
        $set: {
          [`learnedItems.${language}`]: updatedItems,
        },
      }
    );
  } catch (err) {
    console.error(
      `Error adding newly learned items. Received these ${JSON.stringify(
        items
      )}, user ${userId}, language ${language}. ${err}`
    );
  }
}
