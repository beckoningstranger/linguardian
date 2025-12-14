import { Types } from "mongoose";
import logger from "@/utils/logger";

import { ParsedItem } from "@/schemas";
import { ParseResult, SupportedLanguage } from "@linguardian/shared/contracts";
import {
  getAllLemmaObjectIdsForItem,
  getLemmasFromEachParsedItemAndUpload,
} from "@/utils";
import { allLanguageFeatures, allSupportedLanguages } from "@linguardian/shared/constants";
import { ParsedCSVRow, UnitToAdd } from "@/types/types";
import { ItemModel, LemmaModel } from "@/models";
import { createNewItem } from "@/models/item.model";

function keyOf(name: string, lang: SupportedLanguage, pos: string): string {
  return `${name.toLowerCase()}||${lang}||${pos.toLowerCase()}`;
}

export async function processNewItemsForLemmasAndTranslations(
  newItems: ParsedCSVRow[],
  batchTag: string
): Promise<{ newUnitsToAdd: UnitToAdd[]; results: ParseResult[] }> {
  const results: ParseResult[] = [];
  const allHarvestedItems: ParsedItem[] = [];

  // ----------------------------------------
  // 1) For each new main item: lemmas + harvested items + upload
  // ----------------------------------------
  for (const row of newItems) {
    const mainItem = row.item;

    try {
      const lemmaIssues = await getLemmasFromEachParsedItemAndUpload(mainItem);

      const harvested = await harvestItemsWithoutTranslations(mainItem);

      const uploadIssues = await uploadParsedItemsWithoutTranslations(
        harvested,
        batchTag
      );

      if (lemmaIssues.length > 0 || uploadIssues.length > 0) {
        const allIssues = [...lemmaIssues, ...uploadIssues].join("; ");
        results.push({
          row: row.rowNumber,
          name: mainItem.name,
          status: "error",
          message: allIssues,
        });
        continue;
      }

      // Only keep harvested items for rows that had no issues
      allHarvestedItems.push(...harvested);
    } catch (err) {
      results.push({
        row: row.rowNumber,
        name: mainItem.name,
        status: "error",
        message:
          (err as Error).message ||
          "Unknown error while processing lemmas/translations",
      });
    }
  }

  // ----------------------------------------
  // 2) Once everything exists, link items ↔ lemmas and translations
  // ----------------------------------------
  if (allHarvestedItems.length > 0) {
    await Promise.all([
      linkItemsToTheirLemmas(allHarvestedItems),
      addTranslationsToItems(allHarvestedItems),
    ]);
  }

  // ----------------------------------------
  // 3) Resolve IDs for the main items so we can add them to the list
  // ----------------------------------------
  const mainQueries = newItems.map((row) => ({
    name: row.item.name,
    language: row.item.language,
    partOfSpeech: row.item.partOfSpeech,
  }));

  const createdMainItems = mainQueries.length
    ? await ItemModel.find(
        { $or: mainQueries },
        { _id: 1, name: 1, language: 1, partOfSpeech: 1 }
      ).lean()
    : [];

  const idByKey = new Map<string, Types.ObjectId>();
  for (const doc of createdMainItems) {
    const key = keyOf(
      doc.name,
      doc.language as SupportedLanguage,
      doc.partOfSpeech
    );
    idByKey.set(key, doc._id);
  }

  const newUnitsToAdd: UnitToAdd[] = [];

  for (const row of newItems) {
    const i = row.item;
    const key = keyOf(i.name, i.language, i.partOfSpeech);
    const id = idByKey.get(key);

    if (!id) {
      results.push({
        row: row.rowNumber,
        name: i.name,
        status: "error",
        message:
          "Item was created but could not be resolved by name/language/partOfSpeech when building units for list",
      });
      continue;
    }

    newUnitsToAdd.push({
      unitName: i.unit,
      itemId: id,
      rowNumber: row.rowNumber,
      name: i.name,
    });
  }

  return { newUnitsToAdd, results };
}

async function harvestItemsWithoutTranslations(
  item: ParsedItem
): Promise<ParsedItem[]> {
  const harvestedItems: ParsedItem[] = [];

  // Lemmas for the main item
  const mainLemmaIds = await getAllLemmaObjectIdsForItem(
    item.name,
    item.language
  );

  harvestedItems.push({
    ...item,
    lemmas: mainLemmaIds,
  });

  // Create harvested items for translations
  const addTranslationsAsItemsPromises = Object.entries(
    item.translations || {}
  ).map(async ([lang, translations]) => {
    const language = lang as SupportedLanguage;

    if (translations) {
      const addLemmaObjectIds = translations.map(async (translation) => {
        if (!translation || translation.length === 0) return;

        const lemmaIdsForTranslation = await getAllLemmaObjectIdsForItem(
          translation,
          language
        );

        const langFeatures = allLanguageFeatures.find(
          (l) => l.langCode === language
        );
        if (!langFeatures) return;

        harvestedItems.push({
          name: translation,
          language,
          languageName: langFeatures.langName,
          flagCode: langFeatures.flagCode,
          partOfSpeech: item.partOfSpeech,
          lemmas: lemmaIdsForTranslation,
          translations: {
            // translation points back to the main item
            [item.language]: [item.name],
          },
          flags: [],
          unit: item.unit, // ignored for translations when adding to list
        });
      });

      await Promise.all(addLemmaObjectIds);
    }
  });

  await Promise.all(addTranslationsAsItemsPromises);

  return harvestedItems;
}

async function uploadParsedItemsWithoutTranslations(
  items: ParsedItem[],
  batchTag: string
): Promise<string[]> {
  const issues: string[] = [];

  const uploadPromises = items.map(async (item: ParsedItem) => {
    const errorString = (error: string) =>
      `Error uploading item ${item.name}. Part of speech: ${item.partOfSpeech}. Error was: ${error}`;

    try {
      const response = await createNewItem(
        {
          ...item,
          translations: {}, // translations linked later
        },
        batchTag
      );

      if (!response.success) {
        issues.push(errorString(response.error));
      }
    } catch (err) {
      const error = (err as Error).message || "Unknown error occurred";
      issues.push(errorString(error));
      logger.error("Error processing lemma", { error: errorString(error) });
    }
  });

  await Promise.all(uploadPromises);
  return issues;
}

async function addTranslationsToItems(
  harvestedItems: ParsedItem[]
): Promise<void> {
  const filteredItems: ParsedItem[] = harvestedItems.map((item) => {
    return {
      ...item,
      translations: filterOutUndefinedTranslations(item.translations),
    };
  });

  filteredItems.forEach(async (item) => {
    if (!item.translations) return;

    const newTranslationProperty: Partial<
      Record<SupportedLanguage, Types.ObjectId[]>
    > = {};

    Object.entries(item.translations).forEach(
      async ([lang, translationArray]) => {
        const language = lang as SupportedLanguage;

        const items: { _id: Types.ObjectId }[] = await ItemModel.find(
          { name: { $in: translationArray }, language },
          { _id: 1 }
        );

        if (items && items.length > 0) {
          items.forEach((foundItem) => {
            if (!newTranslationProperty[language]) {
              newTranslationProperty[language] = [];
            }
            newTranslationProperty[language]!.push(foundItem._id);
          });
        }

        await ItemModel.findOneAndUpdate(
          {
            name: item.name,
            language: item.language,
            partOfSpeech: item.partOfSpeech,
          },
          {
            $set: {
              translations: newTranslationProperty,
            },
          }
        );
      }
    );
  });
}

async function linkItemsToTheirLemmas(
  harvestedItems: ParsedItem[]
): Promise<void> {
  harvestedItems.map(async (item) => {
    const thisItemsObjectId = await ItemModel.findOne(
      { name: item.name, language: item.language },
      { _id: 1 }
    );
    if (!thisItemsObjectId) return;

    item.lemmas?.forEach(async (lemmaObjectId) => {
      try {
        await LemmaModel.findByIdAndUpdate(lemmaObjectId, {
          $addToSet: {
            items: thisItemsObjectId,
          },
        });
      } catch (err) {
        logger.error("Error linking item to lemma", { itemName: item.name, lemmaObjectId, error: err });
      }
    });
  });
}

function filterOutUndefinedTranslations(
  translations: Partial<Record<SupportedLanguage, string[]>> | undefined
): Partial<Record<SupportedLanguage, string[]>> {
  const translationObject: Partial<Record<SupportedLanguage, string[]>> = {};
  allSupportedLanguages.forEach((lang: SupportedLanguage) => {
    if (translations && translations[lang]) {
      translationObject[lang] = translations[lang]!;
    }
  });
  return translationObject;
}
