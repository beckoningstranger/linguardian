import { Types } from "mongoose";

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
  | "particle"
  | "phrase";

interface LearnedItem {
  itemId: number;
  itemLevel: number;
  nextReview: Date;
}

type Gender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "common"
  | "animate"
  | "inanimate";

type Case =
  | "nominative"
  | "genitive"
  | "dative"
  | "accusative"
  | "instrumental"
  | "locative"
  | "vocative"
  | "accusative & dative";

type Tags = "intransitive" | "archaic" | "literary" | "slang" | "humorous";

type Frequency =
  | "extremely rare"
  | "rare"
  | "medium"
  | "high"
  | "extremely high";

interface Item {
  name: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemmas?: Types.ObjectId[];
  definitions?: string;
  translations?: Partial<Record<SupportedLanguage, Types.ObjectId[]>>;
  gender?: Gender;
  pluralForm?: string;
  case?: Case;
  audio?: Types.Array<string>;
  pics?: Types.Array<string>;
  vids?: Types.Array<string>;
  IPA?: Types.Array<string>;
  tags?: Types.Array<Tags>;
  frequency?: Frequency;
  featuresInList?: Types.ObjectId[];
  collocations?: Types.ObjectId[];
}

type ItemsPopulatedWithTranslations = Omit<Item, "translations"> & {
  translations: Record<SupportedLanguage, Item>;
};

interface Lemma {
  language: SupportedLanguage;
  name: string;
  items?: Types.ObjectId[];
}

type ReviewMode =
  | "Translation"
  | "Context"
  | "SpellingBee"
  | "Dictionary"
  | "Visual";

interface List {
  name: string;
  listNumber: number;
  description?: string;
  language: SupportedLanguage;
  // authors: Types.ObjectId[];
  authors: string[];
  private: Boolean;
  units?: { unitName: string; item: Types.ObjectId };
  unitOrder?: string[];
  unlockedReviewModes?: Record<SupportedLanguage, Types.Array<ReviewMode>>;
  learners?: Types.ObjectId[];
}

type PopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: Item }[];
};

type SupportedLanguage = "DE" | "EN" | "FR" | "CN";

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

interface LanguageFeatures {
  langName: string;
  langCode: SupportedLanguage;
  flagCode: string;
  requiresHelperKeys?: string[];
  hasGender?: Gender[];
  hasCases?: Case[];
}

interface GlobalSettings {
  id: number;
  supportedLanguages: SupportedLanguage[];
  languageFeatures: LanguageFeatures[];
  defaultSSRSettings: SSRSettings;
  user: User;
}

interface LearnedLanguage {
  code: SupportedLanguage;
  flag: string;
  learnedItems?: LearnedItem[];
  learnedListIds?: number[];
  customSSRSettings?: SSRSettings;
}

interface User {
  id: number;
  alias: string;
  native: SupportedLanguage;
  languages: LearnedLanguage[];
}

export type {
  User,
  GlobalSettings,
  LearnedLanguage,
  Lemma,
  SSRSettings,
  Item,
  ItemsPopulatedWithTranslations,
  ReviewMode,
  List,
  PopulatedList,
  LanguageFeatures,
  Gender,
  PartOfSpeech,
  LearnedItem,
  Case,
  SupportedLanguage,
  Frequency,
  Tags,
};
