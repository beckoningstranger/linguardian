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

export async function getOnePopulatedListByListId(listId: Types.ObjectId) {
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
  const response = await getOnePopulatedListByListId(listId);
  if (response && response.units) {
    // This part checks for translation mode
    const allTranslationsExist: Partial<Record<SupportedLanguage, Boolean>> =
      {};
    supportedLanguages.map((language) => {
      // Let's assume it can be unlocked
      let languageCanBeUnlocked = true;
      // Check every item for whether if has a translation in this langauge
      response.units.map((item) => {
        if (item && item.translations && item.translations[language])
          if (!(item.translations[language]!.length > 0)) {
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
