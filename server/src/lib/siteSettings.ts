import {
  PartOfSpeech,
  type GlobalSettings,
  type LanguageFeatures,
  type LearningMode,
  type SRSettings,
  type SupportedLanguage,
} from "./types.js";

const allPartsOfSpeech: PartOfSpeech[] = [
  "noun",
  "pronoun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "determiner",
  "interjection",
  "particle",
  "phrase",
];

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
    ipa: {
      help: "https://en.wikipedia.org/wiki/Help:IPA/Standard_German",
      consonants: [
        "b",
        "ç",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "m",
        "n",
        "ŋ",
        "p",
        "pf",
        "ʁ",
        "s",
        "ʃ",
        "t",
        "ts",
        "tʃ",
        "v",
        "x",
        "z",
        "ʔ",
      ],
      vowels: [
        "a",
        "ɐ",
        "ə",
        "ɛ",
        "e",
        "ə",
        "ɪ",
        "i",
        "ɔ",
        "o",
        "œ",
        "ø",
        "ʊ",
        "u",
        "ʏ",
        "y",
        ":",
        ".",
      ],
      dipthongs: ["aɪ", "aʊ", "ɔʏ"],
      rare: {
        vowels: ["ã", "ɛ̃", "ɛɪ", "õ", "ɔ", "ɔʊ", "œ̃", "œːɐ̯"],
        consonants: ["dʒ", "ð", "ɹ", "θ", "w", "ʒ"],
      },
      helperSymbols: [":", ".", "ˈ", "ˌ"],
    },
    hasRomanization: false,
    hasTones: false,
    partsOfSpeech: allPartsOfSpeech,
  } as const,
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
    ipa: {
      help: "https://en.wikipedia.org/wiki/Help:IPA/French",
      consonants: [
        "b",
        "d",
        "f",
        "g",
        "k",
        "l",
        "m",
        "n",
        "ɲ",
        "ŋ",
        "p",
        "ʁ",
        "s",
        "ʃ",
        "t",
        "v",
        "z",
        "ʒ",
      ],
      vowels: [
        "j",
        "w",
        "ɥ",
        "a",
        "ɑ",
        "e",
        "ɛ",
        "ə",
        "i",
        "œ",
        "ø",
        "o",
        "o",
        "ɔ",
        "u",
        "y",
        "ɑ̃",
        "ɛ̃",
        "œ̃",
        "ɔ̃",
        ":",
        ".",
      ],
      dipthongs: [],
      helperSymbols: [":", ".", "‿"],
    },
    hasCases: [],
    hasRomanization: false,
    hasTones: false,
    partsOfSpeech: allPartsOfSpeech,
  } as const,
  {
    langName: "English",
    langCode: "EN",
    flagCode: "GB",
    ipa: {
      help: "https://en.wikipedia.org/wiki/Help:IPA/English",
      consonants: [
        "b",
        "d",
        "ð",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "m",
        "n",
        "ŋ",
        "p",
        "r",
        "s",
        "ʃ",
        "t",
        "θ",
        "v",
        "w",
        "z",
        "ʒ",
      ],
      vowels: ["ɑ", "ɒ", "æ", "ɛ", "ɪ", "i", "ʊ", "u", "ʌ", "ə"],
      dipthongs: ["aɪ", "aʊ", "eɪ", "oʊ", "ɔ", "ɔɪ"],
      rare: { vowels: ["æ̃", "ɜː", "ɒ̃"], consonants: ["x", "ʔ"] },
      helperSymbols: ["ː", "ˈ", "ˌ"],
    },
    hasCases: [],
    hasGender: [],
    hasRomanization: false,
    hasTones: false,
    requiresHelperKeys: [],
    partsOfSpeech: allPartsOfSpeech,
  } as const,
  {
    langName: "Chinese",
    langCode: "CN",
    flagCode: "CN",
    hasRomanization: true,
    ipa: {
      help: "https://en.wikipedia.org/wiki/Help:IPA/Mandarin",
      consonants: [
        "ɕ",
        "f",
        "j",
        "k",
        "l",
        "m",
        "n",
        "ŋ",
        "p",
        "ɻ",
        "s",
        "ʂ",
        "t",
        "ʰ",
        "ʈʂ",
        "w",
        "s",
        "ɥ",
      ],
      vowels: [
        "a",
        "ɑ",
        "ɛ",
        "e",
        "ə",
        "ɚ",
        "ɤ",
        "i",
        "o",
        "ɻ̩",
        "ɹ̩",
        "u",
        "ʊ",
        "y",
      ],
      dipthongs: ["aɪ", "aʊ", "eɪ", "oʊ"],
      helperSymbols: [],
    },
    hasCases: [],
    hasGender: [],
    hasTones: true,
    requiresHelperKeys: [],
    partsOfSpeech: allPartsOfSpeech,
  } as const,
] as const;

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
} as const;

const learningModes: LearningMode[] = [
  "learn",
  "translation",
  "context",
  "spellingBee",
  "dictionary",
  "visual",
] as const;

const supportedLanguages: SupportedLanguage[] = [
  "DE",
  "EN",
  "FR",
  "CN",
] as const;

export const siteSettings: GlobalSettings = {
  languageFeatures,
  learningModes,
  supportedLanguages,
  defaultSRSettings,
};