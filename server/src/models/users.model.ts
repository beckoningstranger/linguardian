import bcrypt from "bcryptjs";
import { slugifyString } from "../lib/helperFunctions.js";
import { siteSettings } from "../lib/siteSettings.js";
import {
  ItemForServer,
  LanguageWithFlagAndName,
  LearnedItem,
  RecentDictionarySearches,
  RegisterSchema,
  SupportedLanguage,
  User,
} from "../lib/types.js";
import Items from "./item.schema.js";
import Users from "./users.schema.js";

export async function getUserById(id: string) {
  try {
    const response = await Users.findOne<User>({ id: id }, { _id: 0, __v: 0 });
    if (response) return response;
  } catch (err) {
    console.error(`Error getting user by id: ${err}`);
  }
}

export async function getUserByUsernameSlug(usernameSlug: string) {
  try {
    const response = await Users.findOne(
      { usernameSlug: usernameSlug },
      { _id: 0, __v: 0 }
    );
    if (response) return response;
  } catch (err) {
    console.error(
      `Error getting ObjectId for usernameSlug ${usernameSlug}: ${err}`
    );
  }
}

export async function setLearnedLists(
  userId: string,
  learnedLists: Partial<Record<SupportedLanguage, number[]>>
) {
  try {
    return await Users.updateOne<User>(
      { id: userId },
      { $set: { learnedLists } }
    );
  } catch (err) {
    console.error(`Error setting learned lists for user ${userId}: ${err}`);
  }
}

export async function setLearnedLanguagesForUserId(
  userId: string,
  learnedLanguages: LanguageWithFlagAndName[]
) {
  try {
    return await Users.updateOne(
      { id: userId },
      {
        $set: {
          learnedLanguages,
        },
      }
    );
  } catch (err) {
    console.error(`Error setting learned languages for user ${userId}: ${err}`);
  }
}

export async function updateReviewedItems(
  items: ItemForServer[],
  userId: string,
  language: SupportedLanguage
) {
  try {
    const allPassedItemIds = items.map((item) => item.id);
    const user = await getUserById(userId);
    const allLearnedItems = user?.learnedItems[language] || [];
    const userSRSettings =
      user?.customSRSettings[language] || siteSettings.defaultSRSettings;

    const allItemsWeNeedToUpdate = allLearnedItems.filter((item) =>
      allPassedItemIds.includes(item.id)
    );
    const passedItemsAndFetchedItems = allItemsWeNeedToUpdate.map(
      (fetchedItem) => {
        return {
          fetchedItem: fetchedItem,
          passedItem: items.find((item) => item.id === fetchedItem.id),
        };
      }
    );

    passedItemsAndFetchedItems.forEach(async (itemPair) => {
      if (!itemPair)
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

      const newLevelForItem = itemPair.passedItem?.increaseLevel
        ? itemPair.fetchedItem.level + 1 > 10
          ? 10
          : itemPair.fetchedItem.level + 1
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
    const learnedItemsForLanguage = user.learnedItems[language] || [];
    const sRSettings =
      user.customSRSettings[language] || siteSettings.defaultSRSettings;
    const newItemIds = items.map((item) => item.id);
    const filteredItems = learnedItemsForLanguage.filter(
      (learnedItem: LearnedItem) =>
        !newItemIds.some((newItemId) => learnedItem.id === newItemId)
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

export async function getLearningDataForUser(userId: string) {
  try {
    const user = await Users.findOne({ id: userId });
    return {
      learnedItems: user?.learnedItems,
      ignoredItems: user?.ignoredItems as Partial<
        Record<SupportedLanguage, string[]>
      >,
    };
  } catch (err) {
    console.error(`Error getting learned item ids: ${err}`);
  }
}

export async function getNextUserId() {
  const allCredentialsUsers = await Users.find({
    id: { $regex: "^" + "credentials" },
  })
    .select("id")
    .sort({ id: "asc" });
  const onlyIds = allCredentialsUsers.map((x) => x.id);
  const onlyNumbers = onlyIds
    .map((x: string) => +x.replace(/[a-z]/g, ""))
    .sort((a, b) => a - b);

  if (onlyNumbers.length === 0) return 1;
  return onlyNumbers[onlyNumbers.length - 1] + 1;
}

export async function setNativeLanguage(
  userId: string,
  language: SupportedLanguage
) {
  return await Users.updateOne<User>({ id: userId }, { native: language });
}

export async function getNativeLanguageById(userId: string) {
  const user = await Users.findOne<User>({ id: userId });
  return user?.native;
}

export async function getAllUsernameSlugs() {
  return await Users.find<User>({}, { usernameSlug: 1, _id: 0 });
}

export async function addRecentDictionarySearches(
  userId: string,
  slug: string
) {
  const user = await Users.findOne(
    { id: userId },
    { _id: 0, recentDictionarySearches: 1 }
  );
  let recentSearches = user?.recentDictionarySearches || [];
  const item = await Items.findOne({ slug }, { _id: 1 });
  if (item?._id)
    recentSearches.push({ itemId: item._id, dateSearched: new Date() });

  const tenSortedUniqueSearches = recentSearches
    .reduce((acc, curr) => {
      if (
        !acc.some((obj: RecentDictionarySearches) =>
          obj.itemId.equals(curr.itemId)
        )
      ) {
        acc.push(curr);
      }
      return acc;
    }, [] as RecentDictionarySearches[])
    .sort((a, b) => b.dateSearched.getTime() - a.dateSearched.getTime())
    .slice(0, 10);

  return await Users.findOneAndUpdate<User>(
    { id: userId },
    {
      recentDictionarySearches: tenSortedUniqueSearches,
    },
    { new: true }
  );
}

export async function getRecentDictionarySearches(userId: string) {
  return await Users.findOne<User>(
    { id: userId },
    { recentDictionarySearches: 1, _id: 0 }
  );
}

export async function createUser(registrationData: RegisterSchema) {
  const userDataPWEncryptedWithUsernameSlug: RegisterSchema & {
    usernameSlug: string;
  } = {
    ...registrationData,
    usernameSlug: slugifyString(registrationData.username),
    id:
      registrationData.id === "credentials"
        ? "credentials" + (await getNextUserId())
        : registrationData.id,
    password: registrationData.password
      ? await bcrypt.hash(registrationData.password, 10)
      : undefined,
  };

  return await Users.create(userDataPWEncryptedWithUsernameSlug);
}

export async function getUserByEmail(email: string) {
  return await Users.findOne({ email });
}

export async function checkUsernameAvailability(username: string) {
  return await Users.findOne({ username });
}
