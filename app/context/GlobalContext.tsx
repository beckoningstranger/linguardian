"use client";
import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useState,
} from "react";

export type SupportedLanguage = "DE" | "EN" | "FR" | "CN" | "SE" | "NOR";

export type partOfSpeech =
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

export interface Item {
  partOfSpeech: partOfSpeech;
  gender: Partial<Record<SupportedLanguage, string>>;
  meaning: Partial<Record<SupportedLanguage, string[]>>;
}

const defaultReviewTimes = {
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
};

const defaultItemsPerSession = { learning: 5, reviewing: 20 };

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
  name: SupportedLanguage;
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
  languages: LearnedLanguage[]; // will have to make sure this is set at user creation
  addendums?: Addendum[];
  learningHistory?: LearningHistory;
  settings: Settings;
  credentials: Credentials;
  profile: Profile;
}

const user: User = {
  id: 1,
  alias: "User1",
  native: "DE",
  languages: [
    {
      name: "EN",
      learnedListIds: [1, 2],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
    {
      name: "FR",
      learnedListIds: [1, 2, 3],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
    {
      name: "SE",
      learnedListIds: [],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
    {
      name: "CN",
      learnedListIds: [],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
  ],
  addendums: [{}],
  learningHistory: {},
  settings: {},
  credentials: {},
  profile: {},
};

type GlobalContextType = {
  showMobileMenu: Boolean;
  toggleMobileMenuOff?: Function;
  currentlyActiveLanguage?: SupportedLanguage;
  setCurrentlyActiveLanguage?: Function;
  showMobileLanguageSelector?: Boolean;
  toggleMobileLanguageSelectorOn?: MouseEventHandler;
  user: User;
};

export const GlobalContext = createContext<GlobalContextType>({
  showMobileMenu: false,
  user: user,
});

export function GlobalContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguageSelector, setShowMobileLanguageSelector] =
    useState(false);
  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] =
    useState<SupportedLanguage>("FR");

  function toggleMobileMenuOff() {
    setShowMobileMenu(false);
    setShowMobileLanguageSelector(false);
  }

  function toggleMobileLanguageSelectorOn() {
    setShowMobileLanguageSelector(true);
    setShowMobileMenu(true);
  }

  return (
    <GlobalContext.Provider
      value={{
        showMobileMenu,
        toggleMobileMenuOff,
        currentlyActiveLanguage,
        setCurrentlyActiveLanguage,
        showMobileLanguageSelector,
        toggleMobileLanguageSelectorOn,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
