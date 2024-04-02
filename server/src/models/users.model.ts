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

export async function getUserById(id: number) {
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

export async function getUserWithPopulatedLearnedLists(userId: number) {
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

export async function addListToDashboard(userId: number, listNumber: number) {
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

export async function addNewLanguage(
  userId: number,
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
  userId: number,
  language: SupportedLanguage
) {
  try {
    const allPassedItemIds = items.map((item) => item.id as unknown as string);
    const allLearnedItems = await getAllLearnedItems(userId, language);
    const userSRSettings = await getUserSRSettings(userId, language);
    if (!allLearnedItems || !userSRSettings) return;

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
      if (!itemPair) return;
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
  userId: number,
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
  userId: number,
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

async function getUserSRSettings(userId: number, language: SupportedLanguage) {
  const user = await Users.findOne({ id: userId });
  if (!user) return;
  const languageData = user.languages.find((lang) => lang.code === language);
  return languageData?.customSRSettings;
}
