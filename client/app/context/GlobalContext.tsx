"use client";
import { PropsWithChildren, createContext, useState } from "react";
import {
  SupportedLanguage,
  LanguageFeatures,
  SSRSettings,
  User,
} from "@/types";

export const languageFeatures: Record<SupportedLanguage, LanguageFeatures> = {
  DE: {
    name: "German",
    flagCode: "DE",
    requiresHelperKeys: ["ö", "Ö", "ä", "Ä", "ü", "Ü", "ß", "ẞ"],
    hasGender: ["feminine", "masculine", "neuter"],
  },
  FR: {
    name: "French",
    flagCode: "FR",
    requiresHelperKeys: [
      "à",
      "â",
      "ç",
      "Ç",
      "è",
      "É",
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
    hasGender: ["feminine", "masculine"],
  },
  EN: {
    name: "English",
    flagCode: "GB",
  },
  CN: {
    name: "Chinese",
    flagCode: "CN",
  },
};

const defaultSSRSettings: SSRSettings = {
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
};

const user: User = {
  id: 1,
  alias: "User1",
  native: "DE",
  languages: [
    {
      code: "FR",
      learnedListIds: [1, 2],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultSSRSettings.reviewTimes,
        itemsPerSession: defaultSSRSettings.itemsPerSession,
      },
    },
    {
      code: "DE",
      learnedListIds: [1, 2, 3],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultSSRSettings.reviewTimes,
        itemsPerSession: defaultSSRSettings.itemsPerSession,
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
  currentlyActiveLanguage: SupportedLanguage;
  setCurrentlyActiveLanguage?: Function;
  toggleMobileMenu?: Function;
  user: User;
  languageFeatures: Record<SupportedLanguage, LanguageFeatures>;
};

export const GlobalContext = createContext<GlobalContextType>({
  showMobileMenu: false,
  user: user,
  currentlyActiveLanguage: user.languages[0].code,
  languageFeatures: languageFeatures,
});

export function GlobalContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] =
    useState<SupportedLanguage>(user.languages[1].code);

  function toggleMobileMenu() {
    setShowMobileMenu((active) => !active);
  }

  return (
    <GlobalContext.Provider
      value={{
        showMobileMenu,
        toggleMobileMenu,
        currentlyActiveLanguage,
        setCurrentlyActiveLanguage,
        user,
        languageFeatures,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
