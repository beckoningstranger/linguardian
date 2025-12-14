// Types imported after constants are defined to avoid circular dependency
export const supportedLanguageCodes = ["DE", "EN", "FR", "CN"] as const;

export const allListDifficulties = [
  "Novice",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Afficionado",
] as const;

export const allLearningModes = [
  "learn",
  "translation",
  "context",
  "spelling",
  "dictionary",
  "visual",
  "overstudy",
] as const;

export const allTags = [
  "colloquial",
  "archaic",
  "obsolete",
  "vulgar",
  "slang",
  "humorous",
  "literary",
  "transitive",
  "intransitive",
  "Belgian French",
  "Wechselpräposition",
  "countable",
  "uncountable",
] as const;

export const allCases = [
  "nominative",
  "genitive",
  "dative",
  "accusative",
  "instrumental",
  "locative",
  "vocative",
  "accusative & dative",
] as const;

export const allGenders = [
  "masculine",
  "feminine",
  "neuter",
  "common",
  "animate",
  "inanimate",
] as const;

export const allPartsOfSpeech = [
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
] as const;

export const allListStatuses = ["review", "add", "practice"] as const;

export const allSecondaryReviewModes = ["grammaticalCase", "gender"] as const;

export const allTagsSorted: Record<string, string[]> = {
  forAll: [
    "archaic",
    "colloquial",
    "obsolete",
    "vulgar",
    "slang",
    "humorous",
    "literary",
  ],
  verb: ["transitive", "intransitive"],
  noun: ["countable", "uncountable"],
};

const frenchTags = {
  ...allTagsSorted,
  forAll: [...allTagsSorted.forAll, "Belgian French"],
};

export const allLanguageFeatures: readonly any[] = [
  {
    langName: "German",
    langCode: "DE",
    flagCode: "DE",
    requiresHelperKeys: true,
    helperKeys: ["ö", "Ö", "ä", "Ä", "ü", "Ü", "ß", "ẞ"],
    hasGender: true,
    genders: ["feminine", "masculine", "neuter"],
    hasCases: true,
    cases: [
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
        "aɪ",
        "aʊ",
        "ɔʏ",
      ],
      rare: [
        "ã",
        "ɛ̃",
        "ɛɪ",
        "õ",
        "ɔ",
        "ɔʊ",
        "œ̃",
        "œːɐ̯",
        "dʒ",
        "ð",
        "ɹ",
        "θ",
        "w",
        "ʒ",
      ],
      helperSymbols: ["ː", "ˈ", "ˌ"],
    },
    hasRomanization: false,
    hasTones: false,
    tones: [],
    partsOfSpeech: allPartsOfSpeech,
    tags: allTagsSorted,
  },
  {
    langName: "French",
    langCode: "FR",
    flagCode: "FR",
    requiresHelperKeys: true,
    helperKeys: [
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
        "ɔ",
        "u",
        "y",
        "ɑ̃",
        "ɛ̃",
        "œ̃",
        "ɔ̃",
      ],
      helperSymbols: ["ː", "‿", "ˈ", "ˌ"],
    },
    hasGender: true,
    genders: ["feminine", "masculine"],
    hasCases: false,
    cases: [],
    hasRomanization: false,
    hasTones: false,
    tones: [],
    partsOfSpeech: allPartsOfSpeech,
    tags: frenchTags,
  },
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
      vowels: [
        "ɑ",
        "ɒ",
        "æ",
        "ɛ",
        "ɪ",
        "i",
        "ʊ",
        "u",
        "ʌ",
        "ə",
        "aɪ",
        "aʊ",
        "eɪ",
        "oʊ",
        "ɔ",
        "ɔɪ",
      ],
      rare: ["æ̃", "ɜː", "ɒ̃", "x", "ʔ"],
      helperSymbols: ["ː", "‿", "ˈ", "ˌ"],
    },
    hasCases: false,
    cases: [],
    hasGender: false,
    genders: [],
    hasRomanization: false,
    hasTones: false,
    tones: [],
    requiresHelperKeys: false,
    partsOfSpeech: allPartsOfSpeech,
    tags: allTagsSorted,
  },
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
        "aɪ",
        "aʊ",
        "eɪ",
        "oʊ",
      ],
      helperSymbols: [],
    },
    hasCases: false,
    cases: [],
    hasGender: false,
    genders: [],
    hasTones: true,
    tones: [],
    requiresHelperKeys: false,
    partsOfSpeech: allPartsOfSpeech,
    tags: allTagsSorted,
  },
] as const;

export const defaultSRSettings: { reviewTimes: { 1: number; 2: number; 3: number; 4: number; 5: number; 6: number; 7: number; 8: number; 9: number; 10: number; }; itemsPerSession: { learning: number; reviewing: number; }; } = {
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

export const allUserRoles = [
  "learner", // regular user, can create lists and items, cannot delete
  "editor", // all of learner + delete rights
  "moderator", // all of user + moderate mnemonics and message boards, profile posts
  "admin", // full access, can assign roles
  "banned", // no access
] as const;

export const allFlags = ["delete", "proofread", "moderate"] as const;

export const allSupportedLanguages = allLanguageFeatures.map(
  (language) => language.langCode
);

export const allSupportedLanguagesWithNameAndFlag = allLanguageFeatures.map(
  (language) => ({
    code: language.langCode,
    name: language.langName,
    flag: language.flagCode,
  })
);
