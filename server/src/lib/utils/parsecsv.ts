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
