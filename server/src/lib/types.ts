import { Types } from "mongoose";
import { z } from "zod";
import {
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithTranslations,
  parsedItemSchema,
  registerSchema,
} from "./validations";
import {
  allCases,
  allGenders,
  allPartsOfSpeech,
  allTags,
} from "./siteSettings";

export type PartOfSpeech = (typeof allPartsOfSpeech)[number];
export type Gender = (typeof allGenders)[number];
export type Case = (typeof allCases)[number];
export type Tag = (typeof allTags)[number];

export interface sortedTags {
  forAll: Tag[];
  [key: string]: Tag[];
}

export type Item = z.infer<typeof itemSchemaWithTranslations> & {
  _id: Types.ObjectId;
};
export type ItemWithPopulatedTranslations = z.infer<
  typeof itemSchemaWithPopulatedTranslations
> & { _id: Types.ObjectId };

export type ItemToLearn = ItemWithPopulatedTranslations & {
  learningStep: number;
  firstPresentation: boolean;
  increaseLevel: boolean;
};

export type ItemForServer = { id: string; increaseLevel: boolean };

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
  language: LanguageWithFlagAndName;
  description?: string;
  image?: string;
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

export type SRSettings = {
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
};

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
  partsOfSpeech: readonly PartOfSpeech[];
  tags: sortedTags;
}

export interface GlobalSettings {
  learningModes: LearningMode[];
  supportedLanguages: SupportedLanguage[];
  languageFeatures: LanguageFeatures[];
  defaultSRSettings: SRSettings;
}

export interface LearnedItem {
  id: string;
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
  native: LanguageWithFlagAndName;
  learnedLanguages: LanguageWithFlagAndName[];
  learnedLists: Partial<Record<SupportedLanguage, number[]>>;
  learnedItems: Partial<Record<SupportedLanguage, LearnedItem[]>>;
  ignoredItems: Partial<Record<SupportedLanguage, Types.ObjectId[]>>;
  customSRSettings: Partial<Record<SupportedLanguage, SRSettings>>;
  recentDictionarySearches: RecentDictionarySearches[];
  activeLanguageAndFlag?: LanguageWithFlagAndName;
}

export interface RecentDictionarySearches {
  itemId: Types.ObjectId;
  dateSearched: Date;
}

export interface DictionarySearchResult {
  _id: Types.ObjectId;
  normalizedName: string;
  name: string;
  slug: string;
  partOfSpeech: PartOfSpeech;
  IPA?: string[];
  definition?: string[];
  language: SupportedLanguage;
  languageName: string;
  flagCode: string;
}

export interface LanguageWithFlagAndName {
  code: SupportedLanguage;
  flag: string;
  name: string;
}

export interface SlugLanguageObject {
  language: string;
  slug: string;
}

export type StringOrPickOne = string | "Pick one...";

export type Label = { singular: string; plural: string };

export type SeperatedUserLanguages = {
  native: LanguageWithFlagAndName;
  learnedLanguages: LanguageWithFlagAndName[];
};

export type ListAndUnitData = {
  languageWithFlagAndName: LanguageWithFlagAndName;
  listNumber: number;
  listName: string;
  unitNumber: number;
  unitName: string;
};

export type ListDetails = {
  listNumber: number;
  listName?: string;
  unitOrder?: string[];
  listDescription?: string;
};

export type RegisterSchema = z.infer<typeof registerSchema>;
export type ParsedItem = z.infer<typeof parsedItemSchema>;

export type LearningDataForLanguage = {
  learnedItems: LearnedItem[];
  ignoredItems: string[];
};

export type PuzzlePieceObject = {
  position: number;
  content: string;
  first: boolean;
  last: boolean;
};

export type ParsedListInfoFromServer = {
  listNumber: number;
  listLanguage: SupportedLanguage;
  issues?: string[];
};
