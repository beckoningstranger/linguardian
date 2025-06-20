import { Types } from "mongoose";
import { ZodFormattedError } from "zod";

import { ItemWithPopulatedTranslationsFE, SupportedLanguage } from "./types";

export function slugifyString(
  string: string,
  language?: SupportedLanguage
): string {
  return `${language ? language + "-" : ""}${string
    .replace(/[^äöüàáâéèêíìîóòôûúùýỳŷãõũỹa-zA-Z!()': }]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
}

export function normalizeString(string: string): string {
  return string
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

type FlattenedError = {
  [key: string]: string[];
};

export function formatZodErrors(
  errors: ZodFormattedError<any, string>
): FlattenedError {
  const formattedErrors: FlattenedError = {};

  for (const [field, error] of Object.entries(errors)) {
    if (typeof error === "object" && error !== null && "_errors" in error) {
      const errorObj = error as { _errors: string[] };
      if (Array.isArray(errorObj._errors) && errorObj._errors.length > 0) {
        formattedErrors[field] = errorObj._errors;
      }
    }
  }

  return formattedErrors;
}

export function createRegexWithMessage({
  nameOfString = "String",
  letters = true,
  numbers = false,
  characters,
}: {
  nameOfString?: string;
  letters?: boolean;
  numbers?: boolean;
  characters: string;
}): [RegExp, string] {
  // Escape special characters in the provided characters
  const escapedCharacters = characters.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Construct regex, ensuring '%' is excluded and '-' is at the end of the character class if needed
  const regex = new RegExp(
    `^[${letters ? "a-zA-Z" : ""}${
      numbers ? "0-9" : ""
    }${escapedCharacters}&&[^%]]+$`
  );

  // Create the validation message
  const message = `${nameOfString} may only contain ${
    letters ? "letters" : ""
  }${letters && numbers ? ", " : ""}${numbers ? "numbers" : ""}${
    (letters || numbers) && characters ? " and " : ""
  }${characters ? `these characters: ${characters}` : ""}`.trim();

  return [regex, message];
}

export function toObjectId(id: string | Types.ObjectId): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId string: "${id}"`);
  }
  return new Types.ObjectId(id);
}

export function arrayToObjectIds(
  ids: string[] | Types.ObjectId[]
): Types.ObjectId[] {
  return ids.map((id) =>
    id instanceof Types.ObjectId ? id : new Types.ObjectId(id)
  );
}

export function transformItemFromFEToBE(item: ItemWithPopulatedTranslationsFE) {
  const transformedItem = {
    ...item,
    _id: toObjectId(item._id),
    lemmas: item.lemmas.map(toObjectId),
    translations: Object.fromEntries(
      Object.entries(item.translations || {}).map(([lang, items]) => [
        lang,
        items.map((entry) => ({
          ...entry,
          _id: toObjectId(entry._id),
          lemmas: entry.lemmas.map(toObjectId),
        })),
      ])
    ),
  };

  return transformedItem;
}
