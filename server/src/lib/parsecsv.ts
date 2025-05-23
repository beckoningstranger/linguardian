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
import { placeholders } from "./constants.js";
import { normalizeString, slugifyString } from "./helperFunctions.js";
import { siteSettings } from "./siteSettings.js";
import {
  Case,
  Gender,
  Item,
  List,
  ParsedItem,
  PopulatedList,
  SupportedLanguage,
  Tag,
} from "./types.js";
import { parsedItemSchema } from "./validations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function parseCSV(filename: string, newList: List) {
  console.log("Parsing CSV File...");
  const newUploadedList = await createList(newList);
  const newListId = newUploadedList?._id;
  if (!newListId) throw new Error("Error creating new list");

  return new Promise<{ newListId: Types.ObjectId; issues: string[] }>(
    (resolve, reject) => {
      const issues: string[] = [];
      const promises: Promise<void>[] = [];

      fs.createReadStream(
        join(__dirname + `../../../data/csvUploads/${filename}`)
      )
        .pipe(parse({ columns: true, comment: "#" }))
        .on("data", async (data) => {
          let formattedData: ParsedItem = {
            name: data.name,
            normalizedName: normalizeString(data.name),
            slug: slugifyString(data.name, newList.language.code),
            language: newList.language.code,
            languageName: siteSettings.languageFeatures.find(
              (lang) => lang.langCode === newList.language.code
            )?.langName!,
            flagCode: siteSettings.languageFeatures.find(
              (lang) => lang.langCode === newList.language.code
            )?.flagCode!,
            partOfSpeech: data.partOfSpeech,
            case:
              data.case && data.case.length > 0
                ? (data.case as Case)
                : undefined,
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
            await getLemmasFromEachItemAndUpload(validatedData);

            // Harvest all possible items from each parsed item
            const harvestedItems: ParsedItem[] =
              await harvestItemsWithoutTranslations(validatedData);
            await uploadItemsWithoutTranslations(harvestedItems);

            await Promise.all([
              linkItemsToTheirLemmas(harvestedItems),
              addTranslationsToItems(harvestedItems),
              addItemsToList(harvestedItems, newListId, newList.language.code),
            ]);
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
            issues,
          });
        });
    }
  );
}

interface LemmaItem {
  name: string;
  language: SupportedLanguage;
}

async function getLemmasFromEachItemAndUpload(item: ParsedItem) {
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
  await uploadLemmas(lemmas);
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

async function harvestItemsWithoutTranslations(
  item: ParsedItem
): Promise<ParsedItem[]> {
  const harvestedItems: ParsedItem[] = [];
  // Get all lemmas object ids for the item itself
  const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(
    item.name,
    item.language
  );

  // Add item itself as harvested item
  harvestedItems.push({
    ...item,
    lemmas: allFoundLemmaObjectIds,
  });

  // Push item translations as own items to harvestedItems
  const addTranslationsAsItemsPromises = Object.entries(
    item.translations || {}
  ).map(async ([lang, translations]) => {
    const language = lang as SupportedLanguage;
    // Each translation is an Object entry of shape SupportedLanguage: string[]

    if (translations) {
      const addLemmaObjectIds = translations.map(async (translation) => {
        if (translation.length > 0) {
          const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(
            translation,
            language
          );

          // Add translation as harvested item
          harvestedItems.push({
            name: translation,
            normalizedName: normalizeString(translation),
            slug: slugifyString(translation, language),
            language: language,
            languageName: siteSettings.languageFeatures.find(
              (lang) => lang.langCode === language
            )?.langName!,
            flagCode: siteSettings.languageFeatures.find(
              (lang) => lang.langCode === language
            )?.flagCode!,
            partOfSpeech: item.partOfSpeech,
            // Add lemma object ids
            lemmas: allFoundLemmaObjectIds,
            translations: {
              // Use item it was harvested from as translation
              [item.language]: [item.name],
            },
          });
        }
      });
      await Promise.all(addLemmaObjectIds);
    }
  });
  await Promise.all(addTranslationsAsItemsPromises);

  return harvestedItems;
}

async function uploadItemsWithoutTranslations(items: ParsedItem[]) {
  const uploadHarvestedItemsPromises = items.map(async (item) => {
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
  });
  await Promise.all(uploadHarvestedItemsPromises);
}

async function addTranslationsToItems(
  harvestedItems: ParsedItem[]
): Promise<void> {
  // We iterate over every translation of every item
  const filteredItems: ParsedItem[] = harvestedItems.map((item) => {
    return {
      ...item,
      translations: filterOutUndefinedTranslations(
        item.translations,
        siteSettings.supportedLanguages
      ),
    };
  });

  filteredItems.forEach(async (item) => {
    if (item.translations) {
      const newTranslationProperty: Partial<
        Record<SupportedLanguage, Types.ObjectId[]>
      > = {};

      Object.entries(item.translations).forEach(async ([lang, translation]) => {
        const language = lang as SupportedLanguage;
        // We get the object ids for every translation of each item...
        const objectIDs = await Items.find(
          { name: { $in: translation }, language: language },
          { _id: 1 }
        );
        if (objectIDs) {
          objectIDs.forEach((idObject) => {
            // ... and save them in an object of type {SupportedLanguage: ObjectId[]}
            if (!newTranslationProperty[language])
              newTranslationProperty[language] = [];
            newTranslationProperty[language]?.push(idObject._id);
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

async function linkItemsToTheirLemmas(
  harvestedItems: ParsedItem[]
): Promise<void> {
  harvestedItems.map(async (item) => {
    const thisItemsObjectId = await Items.findOne(
      { name: item.name, language: item.language },
      { _id: 1 }
    );
    item.lemmas?.forEach(async (lemmaObjectId) => {
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

interface FetchedItem extends Item {
  _id: Types.ObjectId;
}

async function addItemsToList(
  harvestedItems: ParsedItem[],
  newListId: Types.ObjectId,
  listLanguage: SupportedLanguage
) {
  harvestedItems.forEach(async (item) => {
    if (item.language === listLanguage) {
      const itemInDatabase = (await Items.findOne(
        {
          name: item.name,
        },
        { _id: 1 }
      )) as FetchedItem;
      if (itemInDatabase) {
        const itemId = itemInDatabase._id;
        await Lists.findByIdAndUpdate(
          newListId,
          {
            $addToSet: { units: { unitName: item.unit, item: itemId } },
          },
          { upsert: true }
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

function filterOutUndefinedTranslations(
  translations: Partial<Record<SupportedLanguage, string[]>> | undefined,
  supportedLanguages: SupportedLanguage[]
): Partial<Record<SupportedLanguage, string[]>> {
  const translationObject: Partial<Record<SupportedLanguage, string[]>> = {};
  supportedLanguages?.forEach((lang) => {
    if (translations && translations[lang])
      translationObject[lang] = translations[lang];
  });
  return translationObject;
}
