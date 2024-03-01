import { LanguageFeatures, SupportedLanguage } from "../types.js";

export const supportedLanguages: SupportedLanguage[] = ["DE", "EN", "FR", "CN"];

export const languageFeatures: Record<SupportedLanguage, LanguageFeatures> = {
  DE: {
    name: "German",
    flagCode: "DE",
    requiresHelperKeys: ["ö", "Ö", "ä", "Ä", "ü", "Ü", "ß", "ẞ"],
    hasGender: ["feminine", "masculine", "neuter"],
  },
  FR: {
    name: "French",
    flagCode: "FR",
    requiresHelperKeys: [
      "à",
      "â",
      "ç",
      "Ç",
      "è",
      "é",
      "ê",
      "ë",
      "î",
      "ï",
      "ô",
      "ù",
      "û",
      "œ",
    ],
    hasGender: ["feminine", "masculine"],
  },
  EN: {
    name: "English",
    flagCode: "GB",
  },
  CN: {
    name: "Chinese",
    flagCode: "CN",
  },
};
