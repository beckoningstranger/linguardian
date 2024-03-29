import {
  LanguageFeatures,
  SRSettings,
  GlobalSettings,
  SupportedLanguage,
} from "../types.js";

const languageFeatures: LanguageFeatures[] = [
  {
    langName: "German",
    langCode: "DE",
    flagCode: "DE",
    requiresHelperKeys: ["ö", "Ö", "ä", "Ä", "ü", "Ü", "ß", "ẞ"],
    hasGender: ["feminine", "masculine", "neuter"],
    hasCases: [
      "nominative",
      "genitive",
      "dative",
      "accusative",
      "accusative & dative",
    ],
  },
  {
    langName: "French",
    langCode: "FR",
    flagCode: "FR",
    requiresHelperKeys: [
      "à",
      "â",
      "ç",
      "Ç",
      "É",
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
  {
    langName: "English",
    langCode: "EN",
    flagCode: "GB",
  },
  {
    langName: "Chinese",
    langCode: "CN",
    flagCode: "CN",
  },
];

const defaultSRSettings: SRSettings = {
  reviewTimes: {
    1: 4 * 60 * 60 * 1000, // Level 1: 4 hours
    2: 10 * 60 * 60 * 1000, // 10 hours
    3: 24 * 60 * 60 * 1000, // 1 day
    4: 2 * 24 * 60 * 60 * 1000, // 2 days
    5: 4 * 24 * 60 * 60 * 1000, // 4 days
    6: 8 * 24 * 60 * 60 * 1000, // 8 days
    7: 14 * 24 * 60 * 60 * 1000, // 14 days
    8: 30 * 24 * 60 * 60 * 1000, // 1 month
    9: 90 * 24 * 60 * 60 * 1000, // 3 months
    10: 180 * 24 * 60 * 60 * 1000, // 6 months
  },
  itemsPerSession: {
    learning: 5,
    reviewing: 20,
  },
};

const supportedLanguages: SupportedLanguage[] = ["DE", "EN", "FR", "CN"];

export const siteSettings: GlobalSettings = {
  id: 1,
  supportedLanguages: supportedLanguages,
  languageFeatures: languageFeatures,
  defaultSRSettings: defaultSRSettings,
};
