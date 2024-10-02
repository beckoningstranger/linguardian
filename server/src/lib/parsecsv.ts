import { parse } from "csv-parse";
import fs from "fs";
import { Types } from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import Items from "../models/item.schema.js";
import Lemmas from "../models/lemma.schema.js";
import Lists from "../models/list.schema.js";
import {
  createList,
  getPopulatedListByObjectId,
} from "../models/lists.model.js";
import { getSupportedLanguages } from "../models/settings.model.js";
import { placeholders } from "./constants.js";
import { normalizeString, slugifyString } from "./helperFunctions.js";
import {
  Case,
  Gender,
  Item,
  List,
  PartOfSpeech,
  PopulatedList,
  SupportedLanguage,
  Tag,
  ValidatedParsedItem,
} from "./types.js";
import { parsedItemSchema } from "./validations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ItemInPrep {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  normalizedName: string;
  slug: string;
  case?: Case;
  gender?: Gender;
  pluralForm?: string[];
  tags?: Tag[];
  translations?: Partial<Record<SupportedLanguage, string[]>>;
  lemmas?: Types.ObjectId[];
  unit?: string;
}

export async function parseCSV(filename: string, newList: List) {
  console.log("Parsing CSV File...");
  const newUploadedList = await createList(newList);
  const newListId = newUploadedList?._id;
  if (!newListId) throw new Error("Error creating new list");

  return new Promise<{ newListId: Types.ObjectId }>((resolve, reject) => {
    const issues: string[] = [];
    const promises: Promise<void>[] = [];

    fs.createReadStream(
      join(__dirname + `../../../data/csvUploads/${filename}`)
    )
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (data) => {
        let formattedData: ItemInPrep = {
          name: data.name,
          normalizedName: normalizeString(data.name),
          slug: slugifyString(data.name, newList.language),
          language: newList.language,
          partOfSpeech: data.partOfSpeech,
          case:
            data.case && data.case.length > 0 ? (data.case as Case) : undefined,
          gender:
            data.gender && data.gender.length > 0
              ? (data.gender as Gender)
              : undefined,
          pluralForm:
            data.pluralForm && data.pluralForm.length > 0
              ? data.pluralForm?.split(", ")
              : undefined,
          tags: data.tags?.split(", ") as Tag[],
          translations: {
            DE: data.tDE?.split(", "),
            FR: data.tFR?.split(", "),
            EN: data.tEN?.split(", "),
            CN: data.tCN?.split(", "),
          },
          unit: data.unit,
        };

        const {
          data: validatedData,
          success,
          error,
        } = parsedItemSchema.safeParse(formattedData);
        if (!validatedData || !success) {
          error.issues.forEach((issue) => {
            console.error(`${data.name}: ${issue.path} - ${issue.message}`);
            issues.push(`${data.name}: ${issue.path} - ${issue.message}`);
          });
          return;
        }

        const processRow = async () => {
          // Remove translations that are just empty strings
          const cleanedUpData = await cleanUpTranslationProperty(validatedData);

          // Harvest and upload all possible lemmas from each parsed item
          const lemmas = convertItemToLemmas(cleanedUpData);
          await uploadLemmas(lemmas);

          // Harvest all possible items from each parsed item
          const harvestedItems: ItemInPrep[] =
            await harvestAndUploadItemsWithoutTranslations(cleanedUpData);

          // Link items to all of their lemmas
          await linkItemsToLemmas(harvestedItems);

          // Upload all harvested items with all the information supplied
          await addTranslationsToItems(harvestedItems);

          // Add all relevant harvested items to the new list
          await addItemsToList(harvestedItems, newListId, newList.language);
        };

        promises.push(processRow());
      })
      .on("error", (err) => {
        console.error("Error while parsing csv file", err);
        reject(err);
      })
      .on("end", async () => {
        await Promise.allSettled(promises);
        await defineUnitOrder(newListId);
        console.log("ISSUES", issues);
        resolve({
          newListId,
        });
      });
  });
}

interface LemmaItem {
  name: string;
  language: SupportedLanguage;
}

function convertItemToLemmas(item: ValidatedParsedItem): LemmaItem[] {
  // Function to create lemmas from words that are not placeholders
  const createLemmas = (
    words: string[],
    language: SupportedLanguage
  ): LemmaItem[] =>
    words
      .filter((word) => word.length > 0 && !placeholders.includes(word))
      .map((word) => ({ name: word, language }));

  // Extract lemmas from the item's name
  const lemmas: LemmaItem[] = [
    ...createLemmas(item.name.split(" "), item.language),
    ...Object.entries(item.translations || {}).flatMap(([lang, translations]) =>
      translations
        ? createLemmas(
            translations.map((translation) => translation.split(" ")).flat(),
            lang as SupportedLanguage
          )
        : []
    ),
  ];

  return lemmas;
}

async function uploadLemmas(lemmaArray: LemmaItem[]): Promise<void> {
  const lemmaUpload = lemmaArray.map(async (lemma) => {
    try {
      await Lemmas.findOneAndUpdate(
        { name: lemma.name, language: lemma.language },
        { $set: { name: lemma.name, language: lemma.language } },
        { upsert: true }
      );
    } catch (err) {
      console.error(
        `Error while processing lemma ${JSON.stringify(lemma)}: ${err}`
      );
    }
  });
  await Promise.all(lemmaUpload);
}

async function getAllLemmaObjectIdsForItem(
  item: string,
  itemLanguage: SupportedLanguage
) {
  const allWordsinItem = item.split(" ");
  const lemmasForCurrentItem = allWordsinItem.filter(
    (word) => !placeholders.includes(word)
  );

  // Look up ObjectIds for found lemmas up in Mongodb
  const allFoundLemmaObjects = await Lemmas.find(
    { name: { $in: lemmasForCurrentItem }, language: itemLanguage },
    { _id: 1 }
  );
  const allFoundLemmaObjectIds = allFoundLemmaObjects.map(
    (lemmaObject) => lemmaObject._id
  );

  return allFoundLemmaObjectIds;
}

async function harvestAndUploadItemsWithoutTranslations(
  item: ValidatedParsedItem
): Promise<ItemInPrep[]> {
  const harvestedItems: ItemInPrep[] = [];
  // Push item itself to harvestedItems

  // Get all lemmas object ids for the item itself
  const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(
    item.name,
    item.language
  );

  // Add as harvested item
  harvestedItems.push({
    ...item,
    lemmas: allFoundLemmaObjectIds,
  });

  // Push item translations as own items to harvestedItems
  const iterateOverAllTranslations = Object.entries(
    item.translations || {}
  ).map(async (language) => {
    // Destructure into language name and translations
    const [lang, translations] = language;
    if (translations) {
      const addLemmaObjectIds = translations.map(async (translation) => {
        if (translation.length > 0) {
          // Get all lemma object ids for this translation
          const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(
            translation,
            lang as SupportedLanguage
          );

          // Add as harvested item
          const itemToPush: ItemInPrep = {
            name: translation,
            normalizedName: normalizeString(translation),
            slug: slugifyString(translation, lang as SupportedLanguage),
            language: lang as SupportedLanguage,
            partOfSpeech: item.partOfSpeech,
            lemmas: allFoundLemmaObjectIds,
            translations: {
              [item.language]: [item.name],
            },
          };
          harvestedItems.push(itemToPush);
        }
      });
      await Promise.all(addLemmaObjectIds);
    }
  });
  await Promise.all(iterateOverAllTranslations);

  const uploadHarvestedItemsWithoutTranslations = harvestedItems.map(
    async (item) => {
      try {
        await Items.findOneAndUpdate(
          { name: item.name, language: item.language },
          {
            $set: {
              name: item.name,
              normalizedName: item.normalizedName,
              slug: item.slug,
              language: item.language,
              partOfSpeech: item.partOfSpeech,
              lemmas: item.lemmas,
            },
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(
          `Error while processing item ${JSON.stringify(item)}: ${err}`
        );
      }
    }
  );
  await Promise.all(uploadHarvestedItemsWithoutTranslations);
  return harvestedItems;
}

async function addTranslationsToItems(
  harvestedItems: ItemInPrep[]
): Promise<void> {
  // We iterate over every translation of every item
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages) throw new Error("Failed to get supported languages");
  const filteredItems: ItemInPrep[] = harvestedItems.map((item) => {
    return {
      ...item,
      translations: filterOutUndefinedTranslations(item.translations),
    };
  });

  function filterOutUndefinedTranslations(
    translations: Partial<Record<SupportedLanguage, string[]>> | undefined
  ): Partial<Record<SupportedLanguage, string[]>> {
    const translationObject: Partial<Record<SupportedLanguage, string[]>> = {};
    supportedLanguages?.forEach((lang) => {
      if (translations && translations[lang])
        translationObject[lang] = translations[lang];
    });
    return translationObject;
  }

  filteredItems.forEach(async (item) => {
    if (item.translations) {
      const newTranslationProperty: Partial<
        Record<SupportedLanguage, Types.ObjectId[]>
      > = {};

      Object.entries(item.translations).map(async (translationProperty) => {
        const [language, translation] = translationProperty;
        // We get the object ids for every translation of each item...
        const objectIDs = await Items.find(
          { name: { $in: translation }, language: language },
          { _id: 1 }
        );
        if (objectIDs) {
          objectIDs.map((idObject) => {
            // ... and save them in an object of type {SupportedLanguage: ObjectId[]}
            if (!newTranslationProperty[language as SupportedLanguage])
              newTranslationProperty[language as SupportedLanguage] = [];
            newTranslationProperty[language as SupportedLanguage]?.push(
              idObject._id
            );
          });
        }

        // This new object can now serve as the new translation property of the item we want to update
        await Items.findOneAndUpdate(
          { name: item.name, language: item.language },
          {
            ...item,
            translations: newTranslationProperty,
          },
          { upsert: true }
        );
      });
    }
  });
}

async function linkItemsToLemmas(harvestedItems: ItemInPrep[]): Promise<void> {
  harvestedItems.map(async (item) => {
    const thisItemsObjectId = await Items.findOne(
      { name: item.name, language: item.language },
      { _id: 1 }
    );
    item.lemmas?.map(async (lemmaObjectId) => {
      // Since we didn't populate, item.lemmas is an array of ObjectIds
      try {
        // We push the item's ObjectId to the lemmas items array if it's not in already
        await Lemmas.findByIdAndUpdate(lemmaObjectId, {
          $addToSet: {
            items: thisItemsObjectId,
          },
        });
      } catch (err) {
        console.error(
          `Error linking item ${item.name} to lemma with ObjectId ${lemmaObjectId}`
        );
      }
    });
  });
}

async function cleanUpTranslationProperty(
  data: ValidatedParsedItem
): Promise<ValidatedParsedItem> {
  // Delete non-existent translations
  const supportedLanguages = await getSupportedLanguages();
  if (!supportedLanguages) throw new Error("Failed to get supported languages");

  if (data.translations) {
    supportedLanguages.forEach((lang) => {
      if (!data.translations?.[lang]) {
        delete data.translations![lang];
      }
    });
  }

  return data;
}

interface FetchedItem extends Item {
  _id: Types.ObjectId;
}

async function addItemsToList(
  harvestedItems: ItemInPrep[],
  newListId: Types.ObjectId,
  listLanguage: SupportedLanguage
) {
  harvestedItems.forEach(async (item) => {
    if (item.language === listLanguage) {
      const itemInDatabase = (await Items.findOne({
        name: item.name,
      })) as FetchedItem;
      if (itemInDatabase) {
        const itemId = itemInDatabase._id;
        await Lists.findByIdAndUpdate(
          newListId,
          {
            $addToSet: { units: { unitName: item.unit, item: itemId } },
          },
          { upsert: true, new: true }
        );
      }
    }
  });
}

async function defineUnitOrder(newListId: Types.ObjectId) {
  const newList = (await getPopulatedListByObjectId(
    newListId
  )) as PopulatedList;
  if (newList && newList.units) {
    const unitNames = Array.from(
      new Set(newList.units.map((item) => item.unitName))
    );

    await Lists.findByIdAndUpdate(newListId, {
      $set: { unitOrder: unitNames },
    });
  }
}
