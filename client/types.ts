import mongoose from "mongoose";

type SupportedLanguage = "DE" | "EN" | "FR" | "CN";

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

type Case =
  | "nominative"
  | "genitive"
  | "dative"
  | "accusative"
  | "instrumental"
  | "locative"
  | "vocative"
  | "genitive & dative";

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
  lemma?: [{ type: mongoose.Schema.Types.ObjectId; ref: "Lemmas" }];
  definition?: string;
  translation: Partial<Record<SupportedLanguage, string>>; // would actually need an Array of ObjectIDs
  gender?: Gender;
  pluralForm?: string;
  case?: Case;
  audio?: string[];
  pics?: string[];
  vids?: string[];
  IPA?: string[];
  tags?: Tags[];
  frequency?: Frequency;
  featuresInList?: [{ type: mongoose.Schema.Types.ObjectId; ref: "Lists" }];
  collocations?: [{ type: mongoose.Schema.Types.ObjectId; ref: "Items" }];
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
