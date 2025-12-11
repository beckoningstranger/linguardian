import {
  ZodArray,
  ZodDefault,
  ZodEffects,
  ZodNullable,
  ZodObject,
  ZodOptional,
  ZodTypeAny,
  z,
} from "zod";

import { SupportedLanguage } from "@/lib/contracts";
import { allLanguageFeatures, allSupportedLanguages } from "@/lib/siteSettings";
import { formatZodErrors } from "@/lib/utils/shared";

/**
 * Normalize a data object according to a Zod schema.
 * Ensures all expected fields exist, arrays are arrays, objects are objects.
 */
export function normalizeWithSchema<T extends ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  if (schema instanceof ZodEffects) {
    // Unwrap effects to get the inner schema
    return normalizeWithSchema(schema._def.schema, data);
  }

  if (
    schema instanceof ZodOptional ||
    schema instanceof ZodNullable ||
    schema instanceof ZodDefault
  ) {
    const inner = schema._def.innerType || (schema as any)._def.schema;
    if (data === undefined || data === null) {
      // ZodDefault will fill in defaults automatically later
      return schema.parse(data);
    }
    return normalizeWithSchema(inner, data);
  }

  if (schema instanceof ZodObject) {
    const shape = schema.shape;
    const result: Record<string, unknown> = {};
    for (const key in shape) {
      result[key] = normalizeWithSchema(shape[key], (data as any)?.[key]);
    }
    return result;
  }

  // Handle arrays
  if (schema instanceof ZodArray) {
    if (!Array.isArray(data)) return [] as z.infer<T>;
    const normalized = data.map((item) =>
      normalizeWithSchema(schema.element, item)
    );
    return schema.parse(normalized);
  }

  // Primitive types (string, number, boolean, etc.)

  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `normalizeWithSchema validation failed: ${formatZodErrors(result.error)}`
    );
  }

  return result.data;
}

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (allSupportedLanguages as readonly string[]).includes(lang);
}

export function moreLanguagesToLearn(
  amountOfLanguagesUserLearns: number,
  amountOfSupportedLanguages: number
): boolean {
  const amountOfLanguagesThatCanBeLearned = amountOfSupportedLanguages - 1; // native language has to be deducted
  if (amountOfLanguagesUserLearns >= amountOfLanguagesThatCanBeLearned)
    return false;
  return true;
}

export function showLanguageSelector(currentPathname: string): boolean {
  const showLanguageSelectorOnlyOn: string[] = ["dashboard", "listStore"];
  return showLanguageSelectorOnlyOn.some((path) =>
    currentPathname.includes(path)
  );
}

export function getFlagCodeFromLangCode(langCode: SupportedLanguage): string {
  const languageFeaturesForLanguageCode = allLanguageFeatures.find(
    (lang) => lang.langCode === langCode
  );

  if (!languageFeaturesForLanguageCode)
    throw new Error("Language not found in getFlagCodeFromLangCode");

  return languageFeaturesForLanguageCode.flagCode;
}
