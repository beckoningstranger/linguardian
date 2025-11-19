import { join } from "path";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";

import { ParseResult, SupportedLanguage } from "@/lib/contracts";
import {
  parseCSV,
  prepareImportPlan,
  executeImportPlan,
} from "@/lib/importCSV";
import { processNewItemsForLemmasAndTranslations } from "@/lib/importCSV/lemmasAndTranslations";

export async function importCSV(
  filename: string,
  listNumber: number,
  listLanguageCode: SupportedLanguage
): Promise<{ success: boolean; results: ParseResult[] }> {
  // 1. Parse
  const parsed = await parseCSV(filename, listLanguageCode);
  // parsed.rows = valid rows
  // parsed.results = parse-time errors

  // 2. Build plan for valid rows (duplicates / existing / new)
  const plan = await prepareImportPlan(parsed.rows, listNumber);

  // 3. Create items + lemmas + translations for new items
  const { newUnitsToAdd, results: lemmaAndTranslationResults } =
    await processNewItemsForLemmasAndTranslations(plan.newItems);

  // 4. Wire existing + new items into the list and update unitOrder
  const exec = await executeImportPlan(
    plan.existingUnitsToAdd,
    newUnitsToAdd,
    listNumber
  );

  // 5. Combine ALL row results from all phases
  const combined: ParseResult[] = [
    ...parsed.results, // parse-time errors
    ...plan.results, // duplicates / already-on-list info
    ...lemmaAndTranslationResults, // lemma / translation errors
    ...exec.results, // addedExisting / success / list errors
  ];

  // 6. Log only "error" rows
  await saveImportLog(combined, listNumber);

  const hasErrors = combined.some((r) => r.status === "error");

  return {
    success: !hasErrors,
    results: combined,
  };
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
