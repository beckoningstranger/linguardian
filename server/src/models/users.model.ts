import {
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
    if (response) {
      return response;
    }
  } catch (err) {
    console.error(`Error getting user: ${err}`);
  }
}

export async function createUser(user: User) {
  try {
    await Users.findOneAndUpdate<User>({ id: user.id }, user, { upsert: true });
  } catch (err) {
    console.error(`Error creating user. ${err}`);
  }
}

export async function getUserWithPopulatedLearnedLists(
  userId: number,
) {
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
    return await Users.updateOne(
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
