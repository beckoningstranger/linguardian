type SupportedLanguage = "DE" | "EN" | "FR";

type PartOfSpeech =
  | "noun"
  | "pronoun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "determiner"
  | "interjection"
  | "particle";

interface LearnedItem {
  itemId: number;
  itemLevel: number;
  nextReview: Date;
  // itemHistory
}

type Gender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "common"
  | "animate"
  | "inanimate";

interface LanguageFeatures {
  name: string;
  flagCode: string;
  requiresHelperKeys?: string[];
  hasGender?: Partial<Gender>[];
}

interface Item {
  id: number;
  partOfSpeech: PartOfSpeech;
  gender?: Partial<Record<SupportedLanguage, Gender>>;
  meaning: Partial<Record<SupportedLanguage, string>>;
  alternativemeaning?: Partial<Record<SupportedLanguage, string[]>>;
  plural?: Partial<Record<SupportedLanguage, string>>;
}

interface SSRSettings {
  reviewTimes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
  itemsPerSession: { learning: number; reviewing: number };
}

interface LearnedLanguage {
  code: SupportedLanguage;
  learnedItems?: LearnedItem[];
  learnedListIds: number[];
  SSRSettings: SSRSettings;
}

interface Addendum {}

interface LearningHistory {}

interface Settings {}

interface Credentials {}

interface Profile {}

interface User {
  id: number;
  alias: string;
  native: SupportedLanguage;
  languages: LearnedLanguage[];
  addendums?: Addendum[];
  learningHistory?: LearningHistory;
  settings: Settings;
  credentials: Credentials;
  profile: Profile;
}

export type {
  User,
  Profile,
  Credentials,
  Settings,
  LearningHistory,
  Addendum,
  LearnedLanguage,
  SSRSettings,
  Item,
  LanguageFeatures,
  Gender,
  PartOfSpeech,
  LearnedItem,
  SupportedLanguage,
};
