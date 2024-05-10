import {
  ItemForServer,
  LearnedLanguageWithPopulatedLists,
  SupportedLanguage,
  User,
} from "../types.js";
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

export async function getUserObjectIdById(id: number) {
  try {
    const response = await Users.findOne({ id: id }, { _id: 1, __v: 0 });
    if (response) return response;
  } catch (err) {
    console.error(`Error getting ObjectId for id ${id}: ${err}`);
  }
}

export async function createUser(user: User) {
  try {
    await Users.findOneAndUpdate<User>({ id: user.id }, user, { upsert: true });
  } catch (err) {
    console.error(`Error creating user. ${err}`);
  }
}

export async function getUserWithPopulatedLearnedLists(userId: string) {
  try {
    return await Users.findOne<User>(
      { id: userId },
      { languages: 1, _id: 0 }
    ).populate<{
      languages: LearnedLanguageWithPopulatedLists[];
    }>(`languages.learnedLists`);
  } catch (err) {
    console.error(`Error getting learned lists for user ${userId}`);
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
          $push: {
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
