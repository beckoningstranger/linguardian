import { createReadStream } from "fs";
import { unlink } from "fs";
import { parse } from "csv-parse";

import logger from "@/lib/logger";
import { ParseResult, SupportedLanguage } from "@/lib/contracts";
import { CSVParseResult, ParsedCSVRow } from "@/lib/types";
import {
    arrayFromPotentiallyUndefinedString,
    trimPotentiallyUndefinedString,
} from "@/lib/utils/parsecsv";
import {
    allLanguageFeatures,
    supportedLanguageCodes,
} from "@/lib/siteSettings";
import { parsedItemSchema } from "@/lib/schemas";

export function parseCSV(
    file: string,
    listLanguageCode: SupportedLanguage
): Promise<CSVParseResult> {
    const rows: ParsedCSVRow[] = [];
    const results: ParseResult[] = [];
    let rowNumber = 1;

    return new Promise((resolve, reject) => {
        createReadStream(file)
            .pipe(parse({ columns: true, skip_empty_lines: true }))
            .on("data", (row: Record<string, string>) => {
                rowNumber++;

                // Skip rows with no name
                const name = trimPotentiallyUndefinedString(row.name);
                if (!name) return;

                try {
                    // Always use the list language code (CSV doesn't have a language column)
                    const languageCode = listLanguageCode;

                    // Build translations dynamically from supported languages
                    const translations: Record<string, string[]> = {};
                    for (const langCode of supportedLanguageCodes) {
                        translations[langCode] =
                            arrayFromPotentiallyUndefinedString(row[langCode]);
                    }

                    // Build alternativeAnswers dynamically from supported languages
                    const alternativeAnswers: Record<string, string[]> = {};
                    for (const langCode of supportedLanguageCodes) {
                        alternativeAnswers[langCode] =
                            arrayFromPotentiallyUndefinedString(
                                row[`alternativeAnswers.${langCode}`]
                            );
                    }

                    // Build promptHelpers dynamically from supported languages
                    const promptHelpers: Record<string, string | undefined> =
                        {};
                    for (const langCode of supportedLanguageCodes) {
                        promptHelpers[langCode] =
                            trimPotentiallyUndefinedString(
                                row[`promptHelpers.${langCode}`]
                            );
                    }

                    const itemData = {
                        name: name,
                        language: languageCode,
                        partOfSpeech: trimPotentiallyUndefinedString(
                            row.partOfSpeech
                        ),
                        unit: trimPotentiallyUndefinedString(row.unit) || "",
                        translations,
                        tags: arrayFromPotentiallyUndefinedString(row.tags),
                        alternativeAnswers,
                        promptHelpers,
                    };

                    // Validate with Zod schema - this will ensure everything is formatted correctly
                    const validationResult =
                        parsedItemSchema.safeParse(itemData);

                    if (!validationResult.success) {
                        const errorMessages = validationResult.error.errors
                            .map(
                                (err) => `${err.path.join(".")}: ${err.message}`
                            )
                            .join("; ");
                        results.push({
                            row: rowNumber,
                            name: name,
                            status: "error" as const,
                            message: `Validation error: ${errorMessages}`,
                        });
                        return;
                    }

                    const parsedRow: ParsedCSVRow = {
                        rowNumber,
                        item: validationResult.data,
                        rawName: name,
                    };
                    rows.push(parsedRow);
                } catch (err) {
                    results.push({
                        row: rowNumber,
                        name: name || "unknown",
                        status: "error" as const,
                        message: `Parse error: ${
                            err instanceof Error ? err.message : String(err)
                        }`,
                    });
                }
            })
            .on("end", () => {
                unlink(file, () => {
                    logger.debug("Temporary CSV file deleted", {
                        filename: file,
                    });
                });
                resolve({ rows, results });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}
