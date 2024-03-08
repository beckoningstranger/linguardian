"use client";
import { PropsWithChildren, createContext, useState } from "react";
import { SupportedLanguage, User } from "@/types";

const user: User = {
  id: 1,
  alias: "User1",
  native: "DE",
  languages: [
    {
      code: "FR",
      flag: "FR",
      learnedListIds: [1, 2],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
    },
    {
      code: "DE",
      flag: "DE",
      learnedListIds: [1, 2, 3],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
    },
  ],
};

type GlobalContextType = {
  showMobileMenu: Boolean;
  currentlyActiveLanguage: SupportedLanguage;
  setCurrentlyActiveLanguage?: Function;
  toggleMobileMenu?: Function;
  user: User;
};

export const GlobalContext = createContext<GlobalContextType>({
  showMobileMenu: false,
  user: user,
  currentlyActiveLanguage: user.languages[0].code,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
