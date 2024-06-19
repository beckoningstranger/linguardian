import { Types } from "mongoose";
import {
  Item,
  ItemPopulatedWithTranslations,
  LanguageFeatures,
  LearningMode,
  PopulatedList,
  SupportedLanguage,
} from "../types.js";
import Lists from "./list.schema.js";
import { getSupportedLanguages } from "./settings.model.js";
import Settings from "./settings.schema.js";

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
    return await Lists.findOne({ listNumber: listNumber }).populate<{
      units: { unitName: string; item: Item }[];
    }>({ path: "units.item" });
  } catch (err) {
    console.error(`Error getting populated list with listNumber ${listNumber}`);
  }
}

export async function getFullyPopulatedListByListNumber(
  userNative: SupportedLanguage,
  listNumber: number
) {
  try {
    return await Lists.findOne({ listNumber: listNumber }).populate<{
      units: { unitName: string; item: ItemPopulatedWithTranslations }[];
    }>({
      path: "units.item",
      populate: { path: "translations." + userNative },
    });
  } catch (err) {
    console.error(
      `Error getting fully populated list with listNumber ${listNumber}`
    );
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
  const response = (await getPopulatedListByObjectId(listId)) as PopulatedList;
  const supportedLanguages = await getSupportedLanguages();
  if (response?.units && supportedLanguages) {
    // This part checks for translation mode
    const allTranslationsExist: Partial<Record<SupportedLanguage, Boolean>> =
      {};
    supportedLanguages.forEach((language) => {
      // Let's assume it can be unlocked
      let languageCanBeUnlocked = true;
      // Check every item for whether if has a translation and part of speech in this language
      response.units.forEach((unitItem) => {
        if (unitItem?.item?.translations) {
          const translations = unitItem.item.translations[language];

          // It it doesn't, we can't unlock translation mode
          if (translations?.length === 0 || !unitItem.item.partOfSpeech)
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

export async function getListNameAndUnitOrder(listNumber: number) {
  return (await Lists.findOne(
    { listNumber: listNumber },
    { _id: 0, name: 1, unitOrder: 1 }
  )) as { name: string; unitOrder: string[] };
}

export async function getListDataForMetadata(
  listNumber: number,
  unitNumber: number
) {
  const { name, unitOrder, language, description } = (await Lists.findOne(
    { listNumber: listNumber },
    { _id: 0, name: 1, unitOrder: 1, language: 1, description: 1 }
  )) as {
    name: string;
    unitOrder: string[];
    language: SupportedLanguage;
    description: string;
  };
  const { languageFeatures } = (await Settings.findOne(
    { id: 1 },
    { languageFeatures: 1, _id: 0 }
  )) as { languageFeatures: LanguageFeatures[] };
  const languageFeaturesForQueryLanguage = languageFeatures.filter(
    (lang) => lang.langCode === language
  )[0];
  return {
    listName: name,
    unitName: unitOrder[unitNumber - 1],
    langName: languageFeaturesForQueryLanguage?.langName,
    description: description,
  };
}
