import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { slugifyString } from "../lib/helperFunctions.js";
import {
  ItemForServer,
  RecentDictionarySearches,
  RegisterSchema,
  SupportedLanguage,
  User,
  UserWithPopulatedLearnedLists,
} from "../lib/types.js";
import Items from "./item.schema.js";
import { getList } from "./lists.model.js";
import {
  getAllSettings,
  getLanguageFeaturesForLanguage,
} from "./settings.model.js";
import Users from "./users.schema.js";

export async function getUserById(id: string) {
  try {
    const response = await Users.findOne<User>({ id: id }, { _id: 0 });
    if (response) return response;
  } catch (err) {
    console.error(`Error getting user: ${err}`);
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

export async function addListToDashboard(userId: string, listNumber: number) {
  try {
    const list = await getList(listNumber);
    return await Users.updateOne<User>(
      { id: userId, "languages.code": list?.language },
      {
        $push: { "languages.$.learnedLists": list?._id },
      }
    );
  } catch (err) {
    console.error(
      `Error adding list ${listNumber} to user ${userId}'s dashboard: ${err}`
    );
  }
}

export async function removeListFromDashboard(
  userId: string,
  listNumber: number
) {
  try {
    const list = await getList(listNumber);
    return await Users.updateOne<User>(
      { id: userId, "languages.code": list?.language },
      { $pull: { "languages.$.learnedLists": list?._id } }
    );
  } catch (err) {
    console.error(
      `Error removing list ${listNumber} from user ${userId}'s dashboard: ${err}`
    );
  }
}

export async function addNewLanguage(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const languageFeatures = await getLanguageFeaturesForLanguage(language);
    const siteSettings = await getAllSettings();
    if (languageFeatures) {
      return await Users.updateOne(
        { id: userId },
        {
          $addToSet: {
            languages: {
              name: languageFeatures.langName,
              code: languageFeatures.langCode,
              flag: languageFeatures.flagCode,
              learnedItems: [],
              learnedLists: [],
              customSRSettings: siteSettings?.defaultSRSettings,
            },
          },
        }
      );
    }
  } catch (err) {
    console.error(
      `Error adding language ${language} for user ${userId}: ${err}`
    );
  }
}

export async function updateReviewedItems(
  items: ItemForServer[],
  userId: string,
  language: SupportedLanguage
) {
  try {
    const allPassedItemIds = items.map((item) => item.id as unknown as string);
    const allLearnedItems = await getAllLearnedItems(userId, language);
    const userSRSettings = await getUserSRSettings(userId, language);
    if (!allLearnedItems || !userSRSettings)
      throw new Error("Error fetching learned items or user settings");

    const allItemsWeNeedToUpdate = allLearnedItems.filter((item) =>
      allPassedItemIds.includes(item.id.toHexString())
    );
    const passedItemsWithfetchedItems = allItemsWeNeedToUpdate.map(
      (fetchedItem) => {
        return {
          fetchedItem: fetchedItem,
          passedItem: items.find(
            (item) =>
              (item.id as unknown as string) === fetchedItem.id.toHexString()
          ),
        };
      }
    );

    passedItemsWithfetchedItems.forEach(async (itemPair) => {
      if (!itemPair)
        throw new Error("This item was not reviewed, please report this");
      await Users.updateOne<User>(
        { id: userId, "languages.code": language },
        {
          $pull: {
            "languages.$.learnedItems": {
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
        { id: userId, "languages.code": language },
        {
          $push: {
            "languages.$.learnedItems": {
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
  console.log("models.ts, addNewlyAdded", items);
  try {
    const userSRSettings = await getUserSRSettings(userId, language);
    if (!userSRSettings) return;
    const updateItems = items.map(async (item) =>
      Users.updateOne<User>(
        { id: userId, "languages.code": language },
        {
          $push: {
            "languages.$.learnedItems": {
              id: item.id,
              level: 1,
              nextReview: Date.now() + userSRSettings.reviewTimes[1],
            },
          },
        }
      )
    );
    return Promise.all(updateItems);
  } catch (err) {
    console.error(
      `Error adding newly learned items. Received these ${JSON.stringify(
        items
      )}, user ${userId}, language ${language}. ${err}`
    );
  }
}

export async function getAllLearnedItems(
  userId: string,
  language: SupportedLanguage
) {
  try {
    const user = await Users.findOne({ id: userId });
    if (!user) return;
    const selectedLanguageData = user.languages.find(
      (lang) => lang.code === language
    );
    return selectedLanguageData?.learnedItems || [];
  } catch (err) {
    console.error(`Error getting learned item ids: ${err}`);
  }
}

async function getUserSRSettings(userId: string, language: SupportedLanguage) {
  const user = await Users.findOne({ id: userId });
  if (!user) return;
  const languageData = user.languages.find((lang) => lang.code === language);
  return languageData?.customSRSettings;
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

export async function getAllUserIds() {
  return await Users.find<User>({}, { username: 1, _id: 0 });
}

export async function getLearnedLanguageDataWithPopulatedLists(userId: string) {
  const user = await Users.findOne<UserWithPopulatedLearnedLists>(
    { id: userId },
    { languages: 1, _id: 0 }
  ).populate("languages.learnedLists");
  return user?.languages;
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

export async function stopLearningLanguage(
  userId: string,
  language: SupportedLanguage
) {
  return await Users.findOneAndUpdate(
    { id: userId },
    { $pull: { languages: { code: language } } },
    { new: true }
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
