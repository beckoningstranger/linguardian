import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

import { SupportedLanguage } from "@/lib/contracts";

/**
 * Utility function to conditionally join class names with Tailwind merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shuffles an array in place using the Durstenfeld algorithm (optimized Fisher-Yates).
 */
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Flattens a ZodError into a readable list of messages.
 */
export function formatZodErrors(error: ZodError): string {
  const formatted = error.format();
  const messages: string[] = ["Zod encountered errors:"];

  function walk(
    errorObj: Record<string, unknown> | { _errors: string[] },
    path: string[] = []
  ) {
    for (const [key, value] of Object.entries(errorObj)) {
      if (key === "_errors" && Array.isArray(value)) {
        const fieldPath = path.join(".");
        for (const message of value) {
          messages.push(`${fieldPath || "(root)"}: ${message}`);
        }
      } else if (
        typeof value === "object" &&
        value !== null &&
        "_errors" in value
      ) {
        walk(value as any, [...path, key]);
      }
    }
  }

  walk(formatted);

  return messages.join("\n");
}

/**
 * Cache tag builders for user data, list data, dashboard data and list store data.
 */
export const userTag = (userId: string) => `user-data-id-${userId}`;
export const listTag = (listNumber: number) => `list-data-number-${listNumber}`;
export const dashboardTag = (userId: string, language: SupportedLanguage) =>
  `dashboard-data-user-${userId}-${language}`;
export const listStoreTag = (language: SupportedLanguage) =>
  `list-store-data-${language}`;
export const itemTag = (itemId: string) => `item-${itemId}`;
export const dictionaryTag = (userId: string) => `dictionary-user-${userId}`;
