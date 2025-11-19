import { ParseResult, SupportedLanguage } from "@/lib/contracts";
import {
  executeImportPlan,
  parseCSV,
  prepareImportPlan,
  processNewItemsForLemmasAndTranslations,
} from "@/lib/importCSV";
import { saveImportLog } from "@/lib/utils";

export async function importCSV(
  filename: string,
  listNumber: number,
  listLanguageCode: SupportedLanguage,
  username: string
): Promise<ParseResult[]> {
  const batchTag = `${username}_${new Date().toISOString().replace(/:/g, "-")}`;
  // 1. Parse
  const parsed = await parseCSV(filename, listLanguageCode);
  // parsed.rows = valid rows
  // parsed.results = parse-time errors

  // 2. Build plan for valid rows (duplicates / existing / new)
  const plan = await prepareImportPlan(parsed.rows, listNumber);

  // 3. Create items + lemmas + translations for new items
  const { newUnitsToAdd, results: lemmaAndTranslationResults } =
    await processNewItemsForLemmasAndTranslations(plan.newItems, batchTag);

  // 4. Wire existing + new items into the list and update unitOrder
  const exec = await executeImportPlan(
    plan.existingUnitsToAdd,
    newUnitsToAdd,
    listNumber,
    batchTag
  );

  // 5. Combine ALL row results from all phases
  const results: ParseResult[] = [
    ...parsed.results, // parse-time errors
    ...plan.results, // duplicates / already-on-list info
    ...lemmaAndTranslationResults, // lemma / translation errors
    ...exec.results, // addedExisting / success / list errors
  ];

  // 6. Log only "error" rows
  await saveImportLog(results, listNumber, batchTag);

  return results;
}
