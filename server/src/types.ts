import { Types } from "mongoose";

export type PartOfSpeech =
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

export type Gender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "common"
  | "animate"
  | "inanimate";

export type Case =
  | "nominative"
  | "genitive"
  | "dative"
  | "accusative"
  | "instrumental"
  | "locative"
  | "vocative"
  | "accusative & dative";

export type Tags =
  | "intransitive"
  | "archaic"
  | "literary"
  | "slang"
  | "humorous";

export interface Item {
  _id: Types.ObjectId;
  name: string;
  normalizedName: string;
  slug: string;
  language: SupportedLanguage;
  partOfSpeech: PartOfSpeech;
  lemmas?: Types.ObjectId[];
  definition?: string;
  translations?: Partial<Record<SupportedLanguage, Types.ObjectId[]>>;
  gender?: Gender;
  pluralForm?: string;
  case?: Case;
  audio?: Types.Array<string>;
  pics?: Types.Array<string>;
  vids?: Types.Array<string>;
  IPA?: Types.Array<string>;
  tags?: Types.Array<Tags>;
  relevance?: Types.ObjectId[];
  collocations?: Types.ObjectId[];
}

export type ItemPopulatedWithTranslations = Omit<Item, "translations"> & {
  translations: Record<SupportedLanguage, ItemPopulatedWithTranslations[]>;
};

export type ItemToLearn = ItemPopulatedWithTranslations & {
  learningStep: number;
  firstPresentation: Boolean;
  increaseLevel: Boolean;
};

export type ItemForServer = { id: Types.ObjectId; increaseLevel: Boolean };

export interface Lemma {
  language: SupportedLanguage;
  name: string;
  items?: Types.ObjectId[];
}

export type LearningMode =
  | "learn"
  | "translation"
  | "context"
  | "spellingBee"
  | "dictionary"
  | "visual";

export type Difficulty =
  | "Novice"
  | "Advanced Beginner"
  | "Intermediate"
  | "Advanced"
  | "Afficionado";

export interface List {
  name: string;
  listNumber: number;
  description?: string;
  image?: string;
  language: SupportedLanguage;
  difficulty?: Difficulty;
  authors: string[];
  private: Boolean;
  units: { unitName: string; item: Types.ObjectId }[];
  unitOrder: string[];
  unlockedReviewModes:
    | Record<SupportedLanguage, LearningMode[]>
    | Record<string, never>;
  learners?: Types.ObjectId[];
}

export type FullyPopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: ItemPopulatedWithTranslations }[];
};

export type PopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: Item }[];
};

export interface ListStats {
  unlearned: number;
  readyToReview: number;
  learned: number;
  learning: number;
  ignored: number;
}

export type ListStatus = "review" | "add" | "practice";

export type SupportedLanguage = "DE" | "EN" | "FR" | "CN";

export interface SRSettings {
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

export interface IPA {
  help: string;
  consonants: string[];
  vowels: string[];
  dipthongs?: string[];
  rare?: { vowels: string[]; consonants: string[] };
  helperSymbols: string[];
}

export interface LanguageFeatures {
  langName: string;
  langCode: SupportedLanguage;
  flagCode: string;
  requiresHelperKeys?: string[];
  hasGender?: Gender[];
  hasCases?: Case[];
  hasRomanization?: Boolean;
  hasTones?: Boolean;
  ipa?: IPA;
}

export interface GlobalSettings {
  learningModes: LearningMode[];
  supportedLanguages: SupportedLanguage[];
  languageFeatures: LanguageFeatures[];
  defaultSRSettings: SRSettings;
}

export interface LearnedLanguage {
  code: SupportedLanguage;
  name: string;
  flag: string;
  learnedItems: LearnedItem[];
  ignoredItems: Types.ObjectId[];
  learnedLists: Types.ObjectId[];
  customSRSettings?: SRSettings;
}

export type LearnedLanguageWithPopulatedLists = Omit<
  LearnedLanguage,
  "learnedLists"
> & {
  learnedLists: List[];
};

export interface LearnedItem {
  id: Types.ObjectId;
  level: number;
  nextReview: number;
}

export interface User {
  id: string;
  username: string;
  usernameSlug: string;
  email: string;
  password?: string;
  image: string;
  native: SupportedLanguage;
  languages: LearnedLanguage[];
}

export interface DictionarySearchResult {
  name: string;
  slug: string;
  partOfSpeech: PartOfSpeech;
  IPA?: string;
  definition?: string;
  language: SupportedLanguage;
}

export interface LanguageWithFlag {
  name: SupportedLanguage;
  flag: string;
}

export interface SessionUser {
  name: string;
  email: string;
  image: string;
  id: string;
  usernameSlug: string;
  native: LanguageWithFlag;
  isLearning: LanguageWithFlag[];
}
