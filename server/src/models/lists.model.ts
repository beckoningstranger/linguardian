import { Types } from "mongoose";
import { Item, ReviewMode, SupportedLanguage } from "../types.js";
import Lists from "./list.schema.js";
import { supportedLanguages } from "../services/languageInfo.js";

export async function getOneListByListNumber(listNumber: number) {
  try {
    return await Lists.findOne({ listNumber: listNumber }).populate<{
      units: Item[];
    }>("units");
  } catch (err) {
    console.error(`Error getting list with listNumber ${listNumber}`);
  }
}

export async function getOneListByListId(listId: Types.ObjectId) {
  try {
    return await Lists.findOne({ _id: listId }).populate<{ units: Item[] }>(
      "units"
    );
  } catch (err) {
    console.error(`Error getting list with _id ${listId}`);
  }
}

export async function getAllListsForLanguage(language: SupportedLanguage) {
  try {
    return await Lists.find({ language: language });
  } catch (err) {
    console.error(`Error getting all lists for language ${language}`);
  }
}

export async function getLatestListNumber() {
  const latestList = await Lists.findOne().sort("-listNumber");
  if (!latestList?.listNumber) return 1;
  return latestList!.listNumber + 1;
}

export async function unlockReviewMode(
  id: Types.ObjectId,
  language: SupportedLanguage,
  reviewMode: ReviewMode
) {
  await Lists.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { ["unlockedReviewModes." + language]: reviewMode },
    },
    { upsert: true }
  );
}

export async function updateUnlockedReviewModes(listId: Types.ObjectId) {
  // For the moment this checks only for translation mode
  const response = await getOneListByListId(listId);
  if (response && response.units) {
    const allTranslationsExist: Partial<Record<SupportedLanguage, Boolean>> =
      {};
    supportedLanguages.map((language) => {
      let languageCanBeUnlocked = true;
      response.units.map((item) => {
        if (
          !item.translations ||
          !item.translations[language] ||
          !(item.translations[language]!.length > 0)
        )
          languageCanBeUnlocked = false;
      });
      Object.assign(allTranslationsExist, {
        language: languageCanBeUnlocked,
      });
    });
    Object.entries(allTranslationsExist).map(async (language) => {
      const [lang, yes] = language;
      if (yes) {
        await unlockReviewMode(
          listId,
          lang as SupportedLanguage,
          "Translation"
        );
      }
    });
  }
}
