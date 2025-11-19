import { parse } from "csv-parse";
import { createReadStream, unlink } from "fs";
import { join } from "path";

import { SupportedLanguage } from "@/lib/contracts";
import { parsedItemSchema } from "@/lib/schemas";
import {
  allLanguageFeatures,
  supportedLanguageCodes,
} from "@/lib/siteSettings";
import {
  arrayFromPotentiallyUndefinedString,
  trimPotentiallyUndefinedString,
} from "@/lib/utils";
import { CSVParseResult } from "@/lib/types";

export async function parseCSV(
  filename: string,
  listLanguageCode: SupportedLanguage
): Promise<CSVParseResult> {
  const results: CSVParseResult = {
    rows: [],
    results: [],
  };

  const file = join(process.cwd(), "data", "csvUploads", filename);

  let rowNumber = 2; // header = row 1

  const langFeatures = allLanguageFeatures.find(
    (l) => l.langCode === listLanguageCode
  );
  if (!langFeatures) {
    throw new Error(`Could not find language features for ${listLanguageCode}`);
  }

  return new Promise((resolve, reject) => {
    createReadStream(file)
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", (data) => {
        // skip blank rows
        const isEmpty = Object.values(data).every(
          (v) => typeof v === "string" && v.trim() === ""
        );
        if (isEmpty) return;

        const parsedItem = {
          name: trimPotentiallyUndefinedString(data.name),
          language: listLanguageCode,
          languageName: langFeatures.langName,
          flagCode: langFeatures.flagCode,
          partOfSpeech: trimPotentiallyUndefinedString(data.partOfSpeech),
          grammaticalCase: trimPotentiallyUndefinedString(data.case),
          gender: trimPotentiallyUndefinedString(data.gender),
          pluralForm:
            data.partOfSpeech === "noun"
              ? arrayFromPotentiallyUndefinedString(data.pluralForm)
              : undefined,
          tags: arrayFromPotentiallyUndefinedString(data.tags),
          unit: trimPotentiallyUndefinedString(data.unit),
          translations: {} as Partial<Record<SupportedLanguage, string[]>>,
        };

        for (const code of supportedLanguageCodes) {
          const value = data[`t${code}`];
          if (typeof value === "string" && value.trim().length > 0) {
            parsedItem.translations[code] =
              arrayFromPotentiallyUndefinedString(value);
          }
        }

        const parsed = parsedItemSchema.safeParse(parsedItem);
        if (!parsed.success) {
          results.results.push({
            row: rowNumber,
            name: data.name,
            status: "error",
            message: parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
          });
        } else {
          results.rows.push({
            rowNumber,
            item: parsed.data,
            rawName: data.name,
          });
        }

        rowNumber++;
      })
      .on("end", () => {
        unlink(file, () =>
          console.log("Temporary CSV file deleted:", filename)
        );
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
