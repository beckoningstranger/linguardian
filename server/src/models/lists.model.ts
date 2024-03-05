import { Types } from "mongoose";
import {
  Item,
  PopulatedList,
  ReviewMode,
  SupportedLanguage,
} from "../types.js";
import Lists from "./list.schema.js";
import { supportedLanguages } from "../services/languageInfo.js";

export async function getOnePopulatedListByListNumber(listNumber: number) {
  try {
    return await Lists.findOne({ listNumber: listNumber }).populate<{
      units: { unitName: string; item: Item }[];
    }>("units.item");
  } catch (err) {
    console.error(`Error getting list with listNumber ${listNumber}`);
  }
}

export async function getOnePopulatedListByListId(listId: Types.ObjectId) {
  try {
    return await Lists.findOne({ _id: listId }).populate<{
      units: { unitName: string; item: Item }[];
    }>("units.item");
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
  return !latestList?.listNumber ? 1 : latestList.listNumber + 1;
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

export async function getChapterNameByNumber(
  chapterNumber: number,
  listNumber: number
) {
  const list = await Lists.findOne({ listNumber: listNumber });
  return list?.unitOrder ? list.unitOrder[chapterNumber - 1] : null;
}

export async function updateUnlockedReviewModes(listId: Types.ObjectId) {
  const response = (await getOnePopulatedListByListId(listId)) as PopulatedList;
  if (response && response.units) {
    // This part checks for translation mode
    const allTranslationsExist: Partial<Record<SupportedLanguage, Boolean>> =
      {};
    supportedLanguages.map((language) => {
      // Let's assume it can be unlocked
      let languageCanBeUnlocked = true;
      // Check every item for whether if has a translation in this language
      response.units.map((item) => {
        if (
          item.item &&
          item.item.translations &&
          item.item.translations[language]
        )
          if (!(item.item.translations[language]!.length > 0)) {
            // It it doesn't, we can't unlock translation mode
            languageCanBeUnlocked = false;
          }
      });
      if (languageCanBeUnlocked)
        console.log(`Translation mode for ${language} will be unlocked!`);
      Object.assign(allTranslationsExist, {
        [language]: languageCanBeUnlocked,
      });
    });
    Object.entries(allTranslationsExist).map(async (language) => {
      const [lang, canBeUnlocked] = language;
      if (canBeUnlocked) {
        await unlockReviewMode(
          listId,
          lang as SupportedLanguage,
          "Translation"
        );
      }
    });
    // Need to check for more review modes
  }
}
