import { Types } from "mongoose";
import { z } from "zod";
import {
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithTranslations,
} from "./validations.js";

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

export type Tag =
  | "archaic"
  | "obsolete"
  | "vulgar"
  | "slang"
  | "humorous"
  | "literary"
  | "transitive"
  | "intransitive";

export interface sortedTags {
  forAll: Tag[];
  [key: string]: Tag[];
}

export type Item = z.infer<typeof itemSchemaWithTranslations>;
export type ItemWithPopulatedTranslations = z.infer<
  typeof itemSchemaWithPopulatedTranslations
>;

export type ItemToLearn = ItemWithPopulatedTranslations & {
  learningStep: number;
  firstPresentation: boolean;
  increaseLevel: boolean;
};

export type ItemForServer = { id: Types.ObjectId; increaseLevel: boolean };

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
  flag: string;
  difficulty?: Difficulty;
  authors: string[];
  private: boolean;
  units: { unitName: string; item: Types.ObjectId }[];
  unitOrder: string[];
  unlockedReviewModes:
    | Record<SupportedLanguage, LearningMode[]>
    | Record<string, never>;
  learners?: Types.ObjectId[];
}

export type FullyPopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: ItemWithPopulatedTranslations }[];
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
  rare?: string[];
  helperSymbols: string[];
}

export interface LanguageFeatures {
  langName: string;
  langCode: SupportedLanguage;
  flagCode: string;
  requiresHelperKeys: string[];
  hasGender: Gender[];
  hasCases: Case[];
  hasRomanization: boolean;
  hasTones: boolean;
  ipa: IPA;
  partsOfSpeech: PartOfSpeech[];
  tags: sortedTags;
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
  recentDictionarySearches: RecentDictionarySearches[];
}

export interface RecentDictionarySearches {
  itemSlug: string;
  dateSearched: Date;
}

export type UserWithPopulatedLearnedLists = Omit<User, "languages"> & {
  languages: LearnedLanguageWithPopulatedLists[];
};

export interface DictionarySearchResult {
  _id: Types.ObjectId;
  normalizedName: string;
  name: string;
  slug: string;
  partOfSpeech: PartOfSpeech;
  IPA?: string[];
  definition?: string[];
  language: SupportedLanguage;
}

export interface LanguageWithFlag {
  name: SupportedLanguage;
  flag: string;
}

export interface LanguageWithFlagAndName {
  name: SupportedLanguage;
  flag: string;
  langName: string;
}

export interface SessionUser {
  name: string;
  email: string;
  image: string;
  id: string;
  usernameSlug: string;
  native: LanguageWithFlag;
  isLearning: LanguageWithFlag[];
  learnedLists: Partial<Record<SupportedLanguage, number[]>>;
}

export interface SlugLanguageObject {
  language: string;
  slug: string;
}

export type StringOrPickOne = string | "Pick one...";

export type Label = { singular: string; plural: string };

export type UserLanguages = {
  native: SupportedLanguage;
  learning: SupportedLanguage[];
};

export type UserLanguagesWithFlags = {
  native: LanguageWithFlag;
  isLearning: LanguageWithFlag[];
};

export type ListAndUnitData = {
  languageWithFlag: LanguageWithFlag;
  listNumber: number;
  listName: string;
  unitNumber: number;
  unitName: string;
};

export type ListDetails = {
  listNumber: number;
  listName?: string;
  unitOrder?: string[];
};
