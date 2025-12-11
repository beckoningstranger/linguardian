import { randomUUID } from "crypto";
import logger from "@/lib/logger";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import { ParseResult } from "@/lib/contracts";

export function trimPotentiallyUndefinedString(
  value: unknown
): string | undefined {
  return typeof value === "string" && value.length > 0
    ? value.trim()
    : undefined;
}

export function arrayFromPotentiallyUndefinedString(value: unknown): string[] {
  return typeof value === "string" && value.length > 0
    ? value
        .split(", ")
        .map((string) => string.trim())
        .filter(Boolean)
    : [];
}

export function formatResultMessage(results: ParseResult[]): string {
  let resultMessage: string[] = [];

  const resultCount: {
    success: number;
    error: number;
    addedExisting: number;
    duplicate: number;
  } = { success: 0, error: 0, addedExisting: 0, duplicate: 0 };
  results.forEach((result) => resultCount[result.status]++);

  if (resultCount.success > 0)
    resultMessage.push(
      `Added ${resultCount.success} new ${
        resultCount.success === 1 ? "item" : "items"
      }.`
    );

  if (resultCount.addedExisting > 0)
    resultMessage.push(
      `Added ${resultCount.addedExisting} existing ${
        resultCount.addedExisting === 1 ? "item" : "items"
      }.`
    );

  if (resultCount.addedExisting > 0 || resultCount.success > 0)
    resultMessage.push("🎉\n");

  if (resultCount.duplicate > 0)
    resultMessage.push(
      `Ignored ${resultCount.duplicate} ${
        resultCount.duplicate === 1 ? "item" : "items"
      } that ${
        resultCount.duplicate === 1 ? "was" : "were"
      } already on the list.`
    );

  if (resultCount.error > 0)
    resultMessage.push(
      `${resultCount.error} ${
        resultCount.error === 1 ? "item" : "items"
      } could not be imported`
    );

  return resultMessage.join(" ");
}

export async function saveImportLog(
  results: ParseResult[],
  listNumber: number,
  batchTag: string
): Promise<string | null> {
  const errorsOnly = results.filter((r) => r.status === "error");
  if (errorsOnly.length === 0) {
    logger.info("No import errors — no log created");
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

    logger.info("Appended import errors to log file", { count: newEntries.length, filePath });
    return filePath;
  } catch (err) {
    logger.error("Failed to write import error log", { error: err });
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
      logger.warn("No matching log entry found");
      return false;
    }

    await writeFile(filePath, JSON.stringify(updatedLogs, null, 2), "utf-8");
    logger.info("Deleted log entry", { id });
    return true;
  } catch (err) {
    logger.error("Failed to delete log entry", { error: err });
    return false;
  }
}
