import { getLanguageFeaturesForLanguage } from "../models/settings.model.js";
import { SupportedLanguage } from "./types.js";

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

export async function getFlagForLanguage(language: SupportedLanguage) {
  const languageFeatures = await getLanguageFeaturesForLanguage(language);
  if (!languageFeatures?.flagCode) throw new Error("Invalid language");
  return languageFeatures?.flagCode;
}
