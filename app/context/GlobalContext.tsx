"use client";
import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useState,
} from "react";

type GlobalContextType = {
  showMobileMenu: Boolean;
  toggleMobileMenuOff?: Function;
  userLanguages?: string[];
  currentlyActiveLanguage?: string;
  setCurrentlyActiveLanguage?: Function;
  showMobileLanguageSelector?: Boolean;
  toggleMobileLanguageSelectorOn?: MouseEventHandler;
};

export const GlobalContext = createContext<GlobalContextType>({
  showMobileMenu: false,
});

export function GlobalContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguageSelector, setShowMobileLanguageSelector] =
    useState(false);
  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] = useState("FR");

  function toggleMobileMenuOff() {
    setShowMobileMenu(false);
    setShowMobileLanguageSelector(false);
  }

  function toggleMobileLanguageSelectorOn() {
    setShowMobileLanguageSelector(true);
    setShowMobileMenu(true);
  }

  const userLanguages = ["DE", "FR", "GB", "CN"];

  return (
    <GlobalContext.Provider
      value={{
        showMobileMenu,
        toggleMobileMenuOff,
        userLanguages,
        currentlyActiveLanguage,
        setCurrentlyActiveLanguage,
        showMobileLanguageSelector,
        toggleMobileLanguageSelectorOn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
