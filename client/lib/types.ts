import { Types } from "mongoose";
import { z } from "zod";
import {
  casesSchema,
  genderSchema,
  IPASchema,
  itemSchemaWithPopulatedTranslations,
  itemSchemaWithPopulatedTranslationsFE,
  itemSchemaWithTranslations,
  itemSchemaWithTranslationsFE,
  languageFeaturesSchema,
  languageWithFlagAndNameSchema,
  learnedItemSchema,
  parsedItemSchema,
  partOfSpeechSchema,
  populatedTranslationsSchema,
  populatedTranslationsSchemaFE,
  recentDictionarySearchesSchema,
  registerSchema,
  sortedTagsSchema,
  SRSettingsSchema,
  supportedLanguageSchema,
  tagSchema,
  translationsSchema,
  translationsSchemaFE,
  userSchema,
} from "./validations";

export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;
export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type Case = z.infer<typeof casesSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type sortedTags = z.infer<typeof sortedTagsSchema>;

export type Item = z.infer<typeof itemSchemaWithTranslations>;
export type ItemFE = z.infer<typeof itemSchemaWithTranslationsFE>;

export type ItemWithPopulatedTranslations = z.infer<
  typeof itemSchemaWithPopulatedTranslations
>;
export type ItemWithPopulatedTranslationsFE = z.infer<
  typeof itemSchemaWithPopulatedTranslationsFE
>;

export type ItemToLearn = ItemWithPopulatedTranslationsFE & {
  learningStep: number;
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
  units: { unitName: string; item: ItemWithPopulatedTranslationsFE }[];
};

export type PopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: ItemFE }[];
};

export interface ListStats {
  unlearned: number;
  readyToReview: number;
  learned: number;
  learning: number;
  ignored: number;
}

export type ListStatus = "review" | "add" | "practice";

export type SRSettings = z.infer<typeof SRSettingsSchema>;

export type IPA = z.infer<typeof IPASchema>;
export type LanguageFeatures = z.infer<typeof languageFeaturesSchema>;

export interface GlobalSettings {
  learningModes: readonly LearningMode[];
  supportedLanguages: readonly SupportedLanguage[];
  languageFeatures: readonly LanguageFeatures[];
  defaultSRSettings: SRSettings;
  showLanguageSelectorOnlyOn: readonly string[];
}

export type LearnedItem = z.infer<typeof learnedItemSchema>;
export type User = z.infer<typeof userSchema>;

export type RecentDictionarySearches = z.infer<
  typeof recentDictionarySearchesSchema
>;

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

export type LanguageWithFlagAndName = z.infer<
  typeof languageWithFlagAndNameSchema
>;
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
  used: boolean;
};

export type ParsedListInfoFromServer = {
  listNumber: number;
  listLanguage: SupportedLanguage;
  issues?: string[];
};

export type ContextItem = {
  text: string;
  author: string;
  takenFrom?: string;
};

export type MoreReviewsMode = "gender" | "case";

export type ActivityObject = {
  date: Date;
  planted: Partial<Record<SupportedLanguage, number>>;
  reviewed: Partial<Record<SupportedLanguage, number>>;
  mnemonicsCreated: Partial<Record<SupportedLanguage, number>>;
};

export interface ItemPlusLearningInfo extends ItemWithPopulatedTranslationsFE {
  learned: boolean;
  nextReview?: number;
  level?: number;
}

export type PopulatedTranslations = z.infer<typeof populatedTranslationsSchema>;
export type Translations = z.infer<typeof translationsSchema>;
export type TranslationsFE = z.infer<typeof translationsSchemaFE>;
export type PopulatedTranslationsFE = z.infer<
  typeof populatedTranslationsSchemaFE
>;
