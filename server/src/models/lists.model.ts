import { Types } from "mongoose";
import {
  Item,
  ItemWithPopulatedTranslations,
  LearningMode,
  List,
  ListDetails,
  PopulatedList,
  SupportedLanguage,
} from "../lib/types.js";
import Lists from "./list.schema.js";
import { getSupportedLanguages } from "./settings.model.js";

export async function getList(listNumber: number) {
  try {
    return (await Lists.findOne({ listNumber })) as
      | (List & { _id: Types.ObjectId })
      | undefined;
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
    return await Lists.findOne({ listNumber }).populate<{
      units: { unitName: string; item: Item }[];
    }>({ path: "units.item" });
  } catch (err) {
    console.error(`Error getting populated list with listNumber ${listNumber}`);
  }
}

export async function getFullyPopulatedListByListNumber(
  userNative: SupportedLanguage | undefined,
  listNumber: number
) {
  try {
    return await Lists.findOne({ listNumber }).populate<{
      units: { unitName: string; item: ItemWithPopulatedTranslations }[];
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
    return await Lists.find({ "language.code": language });
  } catch (err) {
    console.error(`Error getting all lists for language ${language}`);
  }
}

export async function getNextListNumber() {
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
    const allTranslationsExist: Partial<Record<SupportedLanguage, boolean>> =
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

export async function getAmountOfUnits(listNumber: number) {
  return (
    await Lists.findOne({ listNumber: listNumber }, { _id: 0, unitOrder: 1 })
  )?.unitOrder.length;
}

export async function addItemToList(
  listNumber: number,
  unitName: string,
  itemId: string
) {
  try {
    return await Lists.findOneAndUpdate(
      {
        listNumber: listNumber,
        "units.item": { $ne: itemId },
      },
      {
        $addToSet: {
          units: { unitName: unitName, item: itemId },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error: unknown) {
    const mongoError = error as { code?: number };
    if (mongoError.code === 11000) {
      return null; // Return null to signal duplicate
    }
    throw error;
  }
}

export async function removeItemFromList(listNumber: number, itemId: string) {
  return await Lists.findOneAndUpdate(
    { listNumber: listNumber },
    { $pull: { units: { item: itemId } } },
    { new: true }
  );
}

export async function addUnitToList(listNumber: number, unitName: string) {
  return await Lists.findOneAndUpdate(
    {
      listNumber: listNumber,
    },
    {
      $addToSet: {
        unitOrder: unitName,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

export async function removeUnitFromList(listNumber: number, unitName: string) {
  const removeFromUnitOrder = await Lists.findOneAndUpdate(
    { listNumber: listNumber },
    { $pull: { unitOrder: unitName } },
    { new: true }
  );
  const removeUnitItems = await Lists.updateOne(
    { listNumber: listNumber },
    { $pull: { units: { unitName: unitName } } },
    { new: true }
  );
  if (removeFromUnitOrder && removeUnitItems) return removeUnitItems;
}

export async function removeList(listNumber: number) {
  return await Lists.deleteOne({ listNumber: listNumber });
}

export async function createList(newList: List) {
  return await Lists.findOneAndUpdate(
    {
      listNumber: newList.listNumber,
    },
    newList,
    { upsert: true, new: true }
  );
}

export async function editDetails(listDetails: ListDetails) {
  if (listDetails.listName !== undefined) {
    return await Lists.findOneAndUpdate(
      { listNumber: listDetails.listNumber },
      { name: listDetails.listName },
      { new: true }
    );
  }

  if (listDetails.listDescription !== undefined) {
    return await Lists.findOneAndUpdate(
      { listNumber: listDetails.listNumber },
      { description: listDetails.listDescription },
      { new: true }
    );
  }

  if (listDetails.unitOrder !== undefined) {
    const list = await getList(listDetails.listNumber);
    if (!list) throw new Error("Error getting list");

    let editedUnitName = "";
    let newUnitName = "";

    listDetails.unitOrder.forEach((unitName) => {
      if (!list.unitOrder.includes(unitName)) newUnitName = unitName;
    });

    list.unitOrder.forEach((unitName) => {
      if (!listDetails.unitOrder?.includes(unitName)) editedUnitName = unitName;
    });

    const units = list.units.map((item) => ({
      unitName: item.unitName === editedUnitName ? newUnitName : item.unitName,
      item: item.item,
    }));
    return await Lists.findOneAndUpdate(
      { listNumber: listDetails.listNumber },
      { units: units, unitOrder: listDetails.unitOrder },
      { new: true }
    );
  }
}
