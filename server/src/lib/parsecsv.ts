import { parse } from "csv-parse";
import { createReadStream, unlink } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { Types } from "mongoose";
import { join } from "path";

import {
  Gender,
  GrammaticalCase,
  Item,
  itemSchemaWithTranslations,
  List,
  ParsedTranslations,
  ParseResult,
  SupportedLanguage,
  Tag,
} from "@/lib/contracts";
import { ParsedItem, parsedItemSchema } from "@/lib/schemas";
import {
  allLanguageFeatures,
  allSupportedLanguages,
  supportedLanguageCodes,
} from "@/lib/siteSettings";
import {
  getAllLemmaObjectIdsForItem,
  getLemmasFromEachParsedItemAndUpload,
  safeDbRead,
} from "@/lib/utils";
import Items from "@/models/item.schema";
import { createNewItem } from "@/models/items.model";
import Lemmas from "@/models/lemma.schema";
import Lists from "@/models/list.schema";
import { getListByListNumber } from "@/models/lists.model";
import { randomUUID } from "crypto";

export async function parseCSV(filename: string, newList: List) {
  console.log("Parsing CSV File...");

  return new Promise<ParseResult[]>((resolve, reject) => {
    const results: ParseResult[] = [];
    const promises: Promise<void>[] = [];

    const file = join(process.cwd(), "data", "csvUploads", filename);
    let rowIndex = 2; // Header is row 1

    createReadStream(file)
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (data) => {
        const currentRow = rowIndex++;
        const languageFeatures = allLanguageFeatures.find(
          (lang) => lang.langCode === newList.language.code
        );
        if (!languageFeatures)
          throw new Error("Could not get language features");
        const formattedData: ParsedItem = {
          name: data.name,
          language: newList.language.code,
          languageName: languageFeatures.langName,
          flagCode: languageFeatures.flagCode,
          partOfSpeech: data.partOfSpeech,
          grammaticalCase:
            data.case && data.case.length > 0
              ? (data.case as GrammaticalCase)
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
          unit: data.unit,
          translations: {},
          lemmas: [],
          flags: [],
        };

        const translations: ParsedTranslations = {};

        for (const code of supportedLanguageCodes) {
          const raw = data[`t${code}`];
          if (typeof raw === "string" && raw.trim().length > 0) {
            translations[code] = raw
              .split(", ")
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
        }

        const dataToParse: ParsedItem = { ...formattedData, translations };

        const parsed = parsedItemSchema.safeParse(dataToParse);

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

        const processRow = async () => {
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
                addItemsToList(
                  harvestedItems,
                  newList.listNumber,
                  newList.language.code
                ),
              ]);
              results.push({
                row: currentRow,
                name: validatedData.name,
                status: "success",
                message: "Uploaded successfully",
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
        };

        promises.push(processRow());
      })
      .on("error", (err) => {
        console.error("Error while parsing csv file", err);
        reject(err);
      })
      .on("end", async () => {
        await Promise.all(promises);
        await defineUnitOrder(newList.listNumber);
        unlink(file, (err) => {
          if (err) console.error("Failed to delete uploaded file:", err);
          else console.log(`Deleted uploaded file.`);
        });
        saveImportLog(results, newList.listNumber);
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
              // Use item it was harvested from as translation
              [item.language]: [item.name],
            },
            flags: [],
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
      translations: filterOutUndefinedTranslations(
        item.translations,
        allSupportedLanguages
      ),
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
  harvestedItems: ParsedItem[],
  listNumber: number,
  listLanguage: SupportedLanguage
) {
  for (const item of harvestedItems) {
    if (item.language === listLanguage) {
      const response = await safeDbRead<Item>({
        dbReadQuery: () =>
          Items.findOne({
            name: item.name,
            partOfSpeech: item.partOfSpeech,
            language: item.language,
          }).lean(),
        schemaForValidation: itemSchemaWithTranslations,
      });
      if (!response.success) throw new Error("Could not find item");
      const foundItem = response.data;
      await Lists.findOneAndUpdate(
        {
          listNumber,
        },
        {
          $addToSet: { units: { unitName: item.unit, item: foundItem.id } },
        }
      );
    }
  }
}

async function defineUnitOrder(newListNumber: number): Promise<true> {
  const response = await getListByListNumber(newListNumber);
  if (!response.success) throw new Error("Could not get new list");

  const newList = response.data;

  const unitNames = Array.from(
    new Set(newList.units.map((item) => item.unitName))
  );

  const updateResponse = await Lists.findOneAndUpdate(
    { listNumber: newListNumber },
    {
      $set: { unitOrder: unitNames },
    }
  );
  if (updateResponse) return true;
  throw new Error(`Could not set unit order for list ${newListNumber}`);
}

function filterOutUndefinedTranslations(
  translations: Partial<Record<SupportedLanguage, string[]>> | undefined,
  supportedLanguages: readonly SupportedLanguage[]
): Partial<Record<SupportedLanguage, string[]>> {
  const translationObject: Partial<Record<SupportedLanguage, string[]>> = {};
  supportedLanguages?.forEach((lang) => {
    if (translations && translations[lang])
      translationObject[lang] = translations[lang];
  });
  return translationObject;
}

export async function saveImportLog(
  results: {
    row: number;
    name: string;
    status: "success" | "error";
    message: string;
  }[],
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
