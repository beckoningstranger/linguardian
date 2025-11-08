import { parse } from "csv-parse";
import { createReadStream, unlink } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { Types } from "mongoose";
import { join } from "path";

import {
  Item,
  itemSchemaWithTranslations,
  ParsedTranslations,
  ParseResult,
  SupportedLanguage,
} from "@/lib/contracts";
import { ParsedItem, parsedItemSchema } from "@/lib/schemas";
import {
  allLanguageFeatures,
  allSupportedLanguages,
  supportedLanguageCodes,
} from "@/lib/siteSettings";
import {
  arrayFromPotentiallyUndefinedString,
  getAllLemmaObjectIdsForItem,
  getLemmasFromEachParsedItemAndUpload,
  safeDbRead,
  trimPotentiallyUndefinedString,
} from "@/lib/utils";
import Items from "@/models/item.schema";
import { createNewItem } from "@/models/items.model";
import Lemmas from "@/models/lemma.schema";
import Lists from "@/models/list.schema";
import {
  getListByListNumber,
  getPopulatedListByListNumber,
} from "@/models/lists.model";
import { randomUUID } from "crypto";

export async function parseCSV(
  filename: string,
  listNumber: number,
  listLanguageCode: SupportedLanguage
) {
  console.log("Parsing CSV File...");
  const response = await getPopulatedListByListNumber(listNumber);
  const keyOf = (name: string, lang: SupportedLanguage, pos: string): string =>
    `${name.toLowerCase()}||${lang}||${pos.toLowerCase()}`;
  const itemsAlreadyOnListKeys = new Set<string>();
  if (response.success) {
    for (const unitItem of response.data.units) {
      itemsAlreadyOnListKeys.add(
        keyOf(
          unitItem.item.name,
          unitItem.item.language,
          unitItem.item.partOfSpeech
        )
      );
    }
  }

  return new Promise<ParseResult[]>((resolve, reject) => {
    const results: ParseResult[] = [];
    const promises: Promise<void>[] = [];

    const file = join(process.cwd(), "data", "csvUploads", filename);
    let rowIndex = 2; // Header is row 1

    const languageFeatures = allLanguageFeatures.find(
      (lang) => lang.langCode === listLanguageCode
    );
    if (!languageFeatures) throw new Error("Could not get language features");

    createReadStream(file)
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (data) => {
        if (
          Object.values(data).every(
            (v) => typeof v === "string" && v.trim() === ""
          )
        ) {
          return; // Skip completely empty rows
        }

        const currentRow = rowIndex++;

        const parsedItem = {
          name: trimPotentiallyUndefinedString(data.name),
          language: listLanguageCode,
          languageName: languageFeatures.langName,
          flagCode: languageFeatures.flagCode,
          partOfSpeech: trimPotentiallyUndefinedString(data.partOfSpeech),
          grammaticalCase: trimPotentiallyUndefinedString(data.case),
          gender: trimPotentiallyUndefinedString(data.gender),
          pluralForm:
            data.partOfSpeech === "noun"
              ? arrayFromPotentiallyUndefinedString(data.pluralForm)
              : undefined,
          tags: arrayFromPotentiallyUndefinedString(data.tags),
          unit: trimPotentiallyUndefinedString(data.unit),
          translations: {} as ParsedTranslations,
        };

        for (const code of supportedLanguageCodes) {
          const raw = data[`t${code}`];
          if (typeof raw === "string" && raw.trim().length > 0) {
            parsedItem.translations[code] =
              arrayFromPotentiallyUndefinedString(raw);
          }
        }

        const parsed = parsedItemSchema.safeParse(parsedItem);

        if (!parsed.success) {
          const errorMsg = parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ");
          results.push({
            row: currentRow,
            name: data.name,
            status: "error",
            message: `Validation failed: ${errorMsg}`,
          });
          return;
        }

        const validatedData = parsed.data;

        async function processRow() {
          try {
            const issuesCreatingLemmas =
              await getLemmasFromEachParsedItemAndUpload(validatedData);
            const harvestedItems: ParsedItem[] =
              await harvestItemsWithoutTranslations(validatedData);
            const issuesWhileUploading =
              await uploadParsedItemsWithoutTranslations(harvestedItems);

            if (
              issuesCreatingLemmas.length > 0 ||
              issuesWhileUploading.length > 0
            ) {
              const allIssues = [
                ...issuesCreatingLemmas,
                ...issuesWhileUploading,
              ].join("; ");
              results.push({
                row: currentRow,
                name: validatedData.name,
                status: "error",
                message: allIssues,
              });
            } else {
              await Promise.all([
                linkItemsToTheirLemmas(harvestedItems),
                addTranslationsToItems(harvestedItems),
                addItemsToList(harvestedItems, listNumber, listLanguageCode),
              ]);
              results.push({
                row: currentRow,
                name: validatedData.name,
                status: "success",
                message: "Added successfully",
              });
            }
          } catch (err) {
            results.push({
              row: currentRow,
              name: validatedData.name,
              status: "error",
              message: (err as Error).message || "Unknown error",
            });
          }
        }

        const rowKey = keyOf(
          validatedData.name,
          validatedData.language,
          validatedData.partOfSpeech
        );
        if (itemsAlreadyOnListKeys.has(rowKey)) {
          results.push({
            row: currentRow,
            name: validatedData.name,
            status: "duplicate",
            message: "Already on list; skipped entirely",
          });
          return; // Log as duplicate, then skip entirely
        }

        const key = {
          name: validatedData.name,
          language: validatedData.language,
          partOfSpeech: validatedData.partOfSpeech,
        };

        const found = await Items.exists(key);
        if (found?._id) {
          // Don't touch existing item, just add existing item to list directly

          const addedResponse = await Lists.updateOne(
            {
              listNumber,
            },
            {
              $addToSet: {
                units: {
                  unitName: validatedData.unit,
                  item: found._id,
                },
              },
            }
          );

          if (addedResponse.modifiedCount > 0) {
            results.push({
              row: currentRow,
              name: validatedData.name,
              status: "addedExisting",
              message: "Found existing item in database and added it",
            });
          } else {
            results.push({
              row: currentRow,
              name: validatedData.name,
              status: "error",
              message:
                "Found existing item in database but something went wrong adding it",
            });
          }
          return;
        } else {
          promises.push(processRow());
        }
      })
      .on("error", (err) => {
        console.error("Error while parsing csv file", err);
        reject(err);
      })
      .on("end", async () => {
        await Promise.all(promises);
        await defineUnitOrder(listNumber);
        unlink(file, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
          else console.log(`Deleted uploaded file.`);
        });
        saveImportLog(results, listNumber);
        resolve(results);
      });
  });
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
            language: language,
            languageName: allLanguageFeatures.find(
              (lang) => lang.langCode === language
            )?.langName!,
            flagCode: allLanguageFeatures.find(
              (lang) => lang.langCode === language
            )?.flagCode!,
            partOfSpeech: item.partOfSpeech,
            // Add lemma object ids
            lemmas: allFoundLemmaObjectIds,
            translations: {
              // Use the item which it was harvested from as translation
              [item.language]: [item.name],
            },
            flags: [],
            unit: item.unit, // This will just be ignored, the translation will only be added to the db, not to the list
          });
        }
      });
      await Promise.all(addLemmaObjectIds);
    }
  });
  await Promise.all(addTranslationsAsItemsPromises);

  return harvestedItems;
}

async function uploadParsedItemsWithoutTranslations(items: ParsedItem[]) {
  const issues: string[] = [];
  const uploadHarvestedItemsPromises = items.map(async (item: ParsedItem) => {
    const errorString = (error: string) =>
      `Error uploading item ${item.name}. Part of speech: ${item.partOfSpeech}. Error was: ${error}`;
    try {
      const response = await createNewItem({
        ...item,
        translations: {},
      }); // We can't submit translations at this point, will add later
      if (!response.success) issues.push(errorString(response.error));
    } catch (err) {
      const error = (err as Error).message || "Unknown error occurred";
      issues.push(errorString(error));
      console.error(errorString(error));
    }
  });
  await Promise.all(uploadHarvestedItemsPromises);
  return issues;
}

async function addTranslationsToItems(
  harvestedItems: ParsedItem[]
): Promise<void> {
  // We iterate over every translation of every item
  const filteredItems: ParsedItem[] = harvestedItems.map((item) => {
    return {
      ...item,
      translations: filterOutUndefinedTranslations(item.translations),
    };
  });

  filteredItems.forEach(async (item) => {
    if (item.translations) {
      const newTranslationProperty: Partial<
        Record<SupportedLanguage, Types.ObjectId[]>
      > = {};

      Object.entries(item.translations).forEach(
        async ([lang, translationArray]) => {
          const language = lang as SupportedLanguage;
          // We retrieve the already uploaded items by their name from the db but only need their _ids
          const items: { _id: Types.ObjectId }[] = await Items.find(
            { name: { $in: translationArray }, language: language },
            { _id: 1 }
          );
          if (items) {
            items.forEach((item) => {
              // ... and save them in an object of type {SupportedLanguage: ObjectId[]}
              if (!newTranslationProperty[language])
                newTranslationProperty[language] = [];
              newTranslationProperty[language]?.push(item._id);
            });
          }

          /** This new object can now serve as the new translation property of the item we want to update
           *  But really we probably want to get the item, inspect the translations and only
           *  add to them, not replace them, so there's more work to do */
          await Items.findOneAndUpdate(
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
    if (!thisItemsObjectId) return;
    item.lemmas?.forEach(async (lemmaObjectId) => {
      // Since we didn't populate, item.lemmas is an array of ObjectIds
      try {
        // We push the item's ObjectId to the lemma's items array if it's not in already
        await Lemmas.findByIdAndUpdate(lemmaObjectId, {
          $addToSet: {
            items: thisItemsObjectId,
          },
        });
      } catch (err) {
        console.error(
          `Error linking item ${item.name} to lemma with ObjectId ${lemmaObjectId}: ${err}`
        );
      }
    });
  });
}

async function addItemsToList(
  parsedItems: ParsedItem[],
  listNumber: number,
  listLanguageCode: SupportedLanguage
) {
  for (const item of parsedItems) {
    if (item.language === listLanguageCode) {
      const findItemResponse = await safeDbRead<Item>({
        dbReadQuery: () =>
          Items.findOne({
            name: item.name,
            partOfSpeech: item.partOfSpeech,
            language: item.language,
          }).lean(),
        schemaForValidation: itemSchemaWithTranslations,
      });
      if (!findItemResponse.success) throw new Error("Could not find item");
      const foundItem = findItemResponse.data;

      const updateResponse = await Lists.updateOne(
        {
          listNumber,
        },
        {
          $addToSet: { units: { unitName: item.unit, item: foundItem.id } },
        }
      );
      if (updateResponse.modifiedCount === 0)
        throw new Error(
          `Error adding ${item.partOfSpeech} ${item.name} to list`
        );
    }
  }
}

async function defineUnitOrder(listNumber: number): Promise<true> {
  const response = await getListByListNumber(listNumber);
  if (!response.success) throw new Error("Could not get new list");

  const list = response.data;

  const unitNames = Array.from(
    new Set(list.units.map((item) => item.unitName))
  );

  const updateResponse = await Lists.findOneAndUpdate(
    { listNumber: listNumber },
    {
      $set: { unitOrder: unitNames },
    }
  );
  if (updateResponse) return true;
  throw new Error(`Could not set unit order for list ${listNumber}`);
}

function filterOutUndefinedTranslations(
  translations: Partial<Record<SupportedLanguage, string[]>> | undefined
): Partial<Record<SupportedLanguage, string[]>> {
  const translationObject: Partial<Record<SupportedLanguage, string[]>> = {};
  allSupportedLanguages.forEach((lang) => {
    if (translations && translations[lang])
      translationObject[lang] = translations[lang];
  });
  return translationObject;
}

export async function saveImportLog(
  results: ParseResult[],
  listNumber: number
): Promise<string | null> {
  const errorsOnly = results.filter((r) => r.status === "error");
  if (errorsOnly.length === 0) {
    console.log("✅ No import errors — no log created.");
    return null;
  }

  const logsDir = join(process.cwd(), "data");
  const filePath = join(logsDir, "import-log.json");

  try {
    await mkdir(logsDir, { recursive: true });

    // 🆕 Read existing logs
    let existingLogs: any[] = [];
    try {
      const fileContent = await readFile(filePath, "utf-8");
      existingLogs = JSON.parse(fileContent);
    } catch {
      existingLogs = [];
    }

    // 🆕 Add unique IDs to each new entry
    const newEntries = errorsOnly.map((entry) => ({
      id: randomUUID(),
      ...entry,
      listNumber,
      timestamp: new Date().toISOString(),
    }));

    const updatedLogs = [...existingLogs, ...newEntries];
    await writeFile(filePath, JSON.stringify(updatedLogs, null, 2), "utf-8");

    console.log(
      `⚠️  Appended ${newEntries.length} import errors to ${filePath}`
    );
    return filePath;
  } catch (err) {
    console.error("❌ Failed to write import error log:", err);
    throw err;
  }
}

/* In admin dashboard data getter, do
 * const logs = JSON.parse(await readFile("data/import-log.json", "utf-8"));
 * and send that to the FE
 */

/* Use this function to delete rows from the log*/
export async function deleteImportLogEntry(id: string): Promise<boolean> {
  const filePath = join(process.cwd(), "data", "import-log.json");

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const logs = JSON.parse(fileContent);

    const updatedLogs = logs.filter((entry: any) => entry.id !== id);

    if (updatedLogs.length === logs.length) {
      console.warn("⚠️  No matching log entry found.");
      return false;
    }

    await writeFile(filePath, JSON.stringify(updatedLogs, null, 2), "utf-8");
    console.log(`🗑️  Deleted log entry with id ${id}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to delete log entry:", err);
    return false;
  }
}
