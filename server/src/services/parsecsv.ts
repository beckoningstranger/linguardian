import fs from "fs";
import { parse } from "csv-parse";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Types } from "mongoose";

import {
  PartOfSpeech,
  SupportedLanguage,
  Case,
  Gender,
  Frequency,
  Tags,
  List,
  Item,
} from "../types.js";
import Items from "../models/item.schema.js";
import Lemmas from "../models/lemma.schema.js";
import Lists from "../models/list.schema.js";
import { getLatestListNumber } from "../models/lists.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ParsedData {
  name: string;
  partOfSpeech: PartOfSpeech;
  case?: string;
  gender?: string;
  pluralForm?: string;
  frequency?: Frequency;
  tags?: string;
  tDE?: string;
  tEN?: string;
  tCN?: string;
  tFR?: string;
  unit: string;
}

interface FormattedParsedData {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  case?: Case[];
  gender?: Gender[];
  pluralForm?: string[];
  frequency?: Frequency;
  tags?: Tags[];
  translations: Partial<Record<SupportedLanguage, string[]>>;
  unit?: string;
}

interface ItemInPrep {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemmas: Types.ObjectId[];
  case?: Case[];
  gender?: Gender[];
  pluralForm?: string[];
  frequency?: Frequency;
  tags?: Tags[];
  translations?: Partial<Record<SupportedLanguage, string[]>>;
  unit?: string;
}

interface parseCSVProps {
  filename: string;
  listName: string;
  language: SupportedLanguage;
  // author: Types.ObjectId;
  author: string;
}

export async function parseCSV({
  filename,
  listName,
  language,
  author,
}: parseCSVProps) {
  // Create a new list
  // const authors: Types.ObjectId[] = [];
  const authors: string[] = [];
  authors.push(author);

  const newList: List = {
    name: listName,
    listNumber: await getLatestListNumber(),
    private: false,
    language: language,
    authors: authors,
  };

  const newUploadedList = await Lists.findOneAndUpdate(
    {
      listNumber: newList.listNumber,
    },
    newList,

    { upsert: true, new: true }
  );
  const newListsId = newUploadedList?._id;
  // Check if new list was created
  if (!newListsId) throw new Error("Error creating new list");

  return new Promise<{ newListId: Types.ObjectId; newListNumber: number }>(
    (resolve, reject) => {
      // Parse csv file and create all needed lemmas in MongoDB
      fs.createReadStream(
        join(__dirname + `../../../data/csvUploads/${filename}`)
      )
        .pipe(parse({ columns: true, comment: "#" }))
        .on("data", async (data: ParsedData) => {
          let formattedData: FormattedParsedData = {
            name: data.name,
            language: language,
            partOfSpeech: data.partOfSpeech,
            case: data.case?.split(" ") as Case[],
            gender: data.gender?.split(" ") as Gender[],
            pluralForm: data.pluralForm?.split(", "),
            frequency: data.frequency,
            tags: data.tags?.split(", ") as Tags[],
            translations: {
              DE: data.tDE?.split(", "),
              FR: data.tFR?.split(", "),
              EN: data.tEN?.split(", "),
              CN: data.tCN?.split(", "),
            },
            unit: data.unit,
          };

          // Remove translations that are just empty strings
          formattedData = cleanUpTranslationProperty(formattedData);

          // Harvest and upload all possible lemmas from each parsed item
          const lemmas = convertItemToLemmas(formattedData);
          await UploadLemmas(lemmas);

          // Harvest all possible items from each parsed item
          const harvestedItems: ItemInPrep[] = await harvestAndUploadItems(
            formattedData
          );
          // Link items to all of their lemmas
          await linkItemsToLemmas(harvestedItems);
          // Upload all harvested items with all the information supplied
          await uploadAsProperItems(harvestedItems);

          // Add all relevant harvested items to the new list
          await addItemsToList(harvestedItems, newListsId, language);
        })
        .on("error", (err) => {
          console.error(err);
        })
        .on("end", () => {
          // Wait 10 seconds for parsing and uploading to finish
          setTimeout(() => {
            resolve({
              newListId: newListsId,
              newListNumber: newUploadedList.listNumber,
            });
          }, 10000);
        });
    }
  );
}

interface LemmaItem {
  name: string;
  language: SupportedLanguage;
}
const placeholders = ["jdm", "jdn", "etw", "sb", "sth", "qn", "qc"];

function convertItemToLemmas(item: FormattedParsedData): LemmaItem[] {
  const onlyLemmasArray: LemmaItem[] = [];
  const allWordsArray = item.name.split(" ");
  // Convert item itself to lemmas
  allWordsArray.map((word) => {
    if (!placeholders.includes(word)) {
      onlyLemmasArray.push({ name: word, language: item.language });
    }
  });

  // Convert item translations to lemmas
  // Iterate over all found translations
  Object.entries(item.translations).map((language) => {
    // Destructure into language name and translation
    const [lang, translations] = language;
    // Iterate over all translations, split them up into words
    if (translations)
      translations.map((translation) => {
        const words = translation.split(" ");
        words.map((word) => {
          // Harvest everything that is not a placeholder
          if (word.length > 0 && !placeholders.includes(word))
            onlyLemmasArray.push({
              name: word,
              language: lang as SupportedLanguage,
            });
        });
      });
  });

  return onlyLemmasArray;
}

async function UploadLemmas(lemmaArray: LemmaItem[]): Promise<void> {
  const lemmaUpload = lemmaArray.map(async (lemma) => {
    try {
      console.log(
        `${lemma.language}: Creating lemma entry for '${lemma.name}'.`
      );
      await Lemmas.findOneAndUpdate(
        { name: lemma.name, language: lemma.language },
        { $set: { name: lemma.name, language: lemma.language } },
        { upsert: true }
      );
    } catch (err) {
      console.error(`Error while processing lemma ${lemma}: ${err}`);
    }
  });
  await Promise.all(lemmaUpload);
}

async function getAllLemmaObjectIdsForItem(item: string) {
  const allWordsinItem = item.split(" ");
  const lemmasForCurrentItem = allWordsinItem.filter(
    (word) => !placeholders.includes(word)
  );

  // Look up ObjectIds for found lemmas up in Mongodb
  const allFoundLemmaObjects = await Lemmas.find(
    { name: { $in: lemmasForCurrentItem } },
    { _id: 1 }
  );
  const allFoundLemmaObjectIds = allFoundLemmaObjects.map(
    (lemmaObject) => lemmaObject._id
  );

  return allFoundLemmaObjectIds;
}

async function harvestAndUploadItems(
  item: FormattedParsedData
): Promise<ItemInPrep[]> {
  const harvestedItems: ItemInPrep[] = [];
  // Push item itself to harvestedItems

  // Get all lemmas object ids for the item itself
  const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(item.name);

  // Add as harvested item
  harvestedItems.push({
    ...item,
    lemmas: allFoundLemmaObjectIds,
  });

  // Push item translations as own items to harvestedItems
  const iterateOverAllTranslations = Object.entries(item.translations).map(
    async (language) => {
      // Destructure into language name and translations
      const [lang, translations] = language;
      if (translations) {
        const addLemmaObjectIds = translations.map(async (translation) => {
          if (translation.length > 0) {
            // Get all lemma object ids for this translation
            const allFoundLemmaObjectIds = await getAllLemmaObjectIdsForItem(
              translation
            );

            // Add as harvested item
            const itemToPush: ItemInPrep = {
              name: translation,
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
    }
  );
  await Promise.all(iterateOverAllTranslations);

  const uploadHarvestedItemsWithoutTranslations = harvestedItems.map(
    async (item) => {
      try {
        console.log(
          `${item.language}: Uploading item '${item.name}' without translation.`
        );

        await Items.findOneAndUpdate(
          { name: item.name, language: item.language },
          {
            $set: {
              name: item.name,
              language: item.language,
              partOfSpeech: item.partOfSpeech,
              lemmas: item.lemmas,
            },
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(`Error while processing item ${item}: ${err}`);
      }
    }
  );
  await Promise.all(uploadHarvestedItemsWithoutTranslations);
  return harvestedItems;
}

async function uploadAsProperItems(
  harvestedItems: ItemInPrep[]
): Promise<void> {
  // We iterate over every translation of every item
  harvestedItems.map(async (item) => {
    if (item.translations) {
      console.log(
        `${item.language}: Now filling in translations for item '${item.name}'`
      );
      const newTranslationProperty: Partial<
        Record<SupportedLanguage, Types.ObjectId[]>
      > = {};
      Object.entries(item.translations).map(async (translationProperty) => {
        const [language, translation] = translationProperty;
        // We get the object ids for every translation of each item...
        const objectIDsObject = await Items.find(
          { name: { $in: translation }, language: language },
          { _id: 1 }
        );
        if (objectIDsObject) {
          objectIDsObject.map((idObject) => {
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
    item.lemmas.map(async (lemma) => {
      // Since we didn't populate, lemma is this lemma's ObjectId
      try {
        console.log(
          `Adding item '${item.name}' to lemma with ObjectId '${lemma}'`
        );
        // We push the item's ObjectId to the lemmas items array if it's not in already
        await Lemmas.findByIdAndUpdate(lemma, {
          $addToSet: {
            items: thisItemsObjectId,
          },
        });
      } catch (err) {
        console.error(
          `Error linking item ${item.name} to lemma with ObjectId ${lemma}`
        );
      }
    });
  });
}

function cleanUpTranslationProperty(
  formattedData: FormattedParsedData
): FormattedParsedData {
  // Delete non-existent translations
  const supportedLanguages: SupportedLanguage[] = ["DE", "EN", "FR", "CN"];
  supportedLanguages.map((lang) => {
    if (formattedData.translations[lang]) {
      if (formattedData.translations[lang]![0].length < 1) {
        delete formattedData.translations[lang];
      }
    }
  });
  return formattedData;
}

interface FetchedItem extends Item {
  _id: Types.ObjectId;
}

async function addItemsToList(
  harvestedItems: ItemInPrep[],
  newListId: Types.ObjectId,
  listLanguage: SupportedLanguage
) {
  harvestedItems.map(async (item) => {
    if (item.language === listLanguage) {
      const itemInDatabase = (await Items.findOne({
        name: item.name,
      })) as FetchedItem;
      if (itemInDatabase) {
        const itemId = itemInDatabase._id;
        // First make sure that the needed chapter exists
        const addChapterResponse = await Lists.findByIdAndUpdate(
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
