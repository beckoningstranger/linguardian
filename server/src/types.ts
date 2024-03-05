import { Types } from "mongoose";

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
  unlockedReviewModes?: Partial<
    Record<SupportedLanguage, Types.Array<ReviewMode>>
  >;
  learners?: Types.ObjectId[];
}

type PopulatedList = Omit<List, "units"> & {
  units: { unitName: string; item: Item }[];
};

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
  Lemma,
  SSRSettings,
  Item,
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
