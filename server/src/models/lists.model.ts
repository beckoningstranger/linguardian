import { Types } from "mongoose";
import {
  Item,
  ItemPopulatedWithTranslations,
  PopulatedList,
  PopulatedListNoAuthors,
  LearningMode,
  SupportedLanguage,
  User,
} from "../types.js";
import Lists from "./list.schema.js";
import { getSupportedLanguages } from "./settings.model.js";

export async function getList(listNumber: number) {
  try {
    return await Lists.findOne({ listNumber: listNumber });
  } catch (err) {
    console.error(`Error getting list with listNumber ${listNumber} `);
  }
}

export async function getPopulatedListByObjectId(listId: Types.ObjectId) {
  try {
    return await Lists.findOne({ _id: listId }).populate<{
      units: { unitName: string; item: Item }[];
    }>({ path: "units.item" });
  } catch (err) {
    console.error(`Error getting populated list with _id ${listId}`);
  }
}

export async function getPopulatedListByListNumber(listNumber: number) {
  try {
    return await Lists.findOne({ listNumber: listNumber })
      .populate<{
        units: { unitName: string; item: Item }[];
      }>({ path: "units.item" })
      .populate<{ authors: User[] }>({ path: "authors" });
  } catch (err) {
    console.error(`Error getting populated list with listNumber ${listNumber}`);
  }
}

export async function getFullyPopulatedListByListNumber(
  userNative: SupportedLanguage,
  listNumber: number
) {
  try {
    return await Lists.findOne({ listNumber: listNumber })
      .populate<{
        units: { unitName: string; item: ItemPopulatedWithTranslations }[];
      }>({
        path: "units.item",
        populate: { path: "translations." + userNative },
      })
      .populate<{ authors: User[] }>({ path: "authors" });
  } catch (err) {
    console.error(
      `Error getting fully populated list with listNumber ${listNumber}`
    );
  }
}

export async function getAllListsForLanguage(language: SupportedLanguage) {
  try {
    return await Lists.find({ language: language }).populate<{
      authors: User[];
    }>({ path: "authors" });
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
  reviewMode: LearningMode
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
  const response = (await getPopulatedListByObjectId(
    listId
  )) as PopulatedListNoAuthors;
  const supportedLanguages = await getSupportedLanguages();
  if (response && response.units && supportedLanguages) {
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
          "translation"
        );
      }
    });
    // Need to check for more review modes
  }
}
