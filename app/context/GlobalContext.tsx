"use client";
import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useState,
} from "react";

type GlobalContextType = {
  showSidebar: Boolean;
  toggleSidebar?: MouseEventHandler;
  userLanguages?: string[];
  currentlyActiveLanguage?: string;
  setCurrentlyActiveLanguage?: Function;
};

export const GlobalContext = createContext<GlobalContextType>({
  showSidebar: false,
});

export function GlobalContextProvider({ children }: PropsWithChildren) {
  const [showSidebar, setShowSideBar] = useState(false);
  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] = useState("FR");

  function toggleSidebar() {
    setShowSideBar((topMenuOpen) => !topMenuOpen);
  }

  const userLanguages = ["DE", "FR", "GB", "CN"];

  return (
    <GlobalContext.Provider
      value={{
        showSidebar,
        toggleSidebar,
        userLanguages,
        currentlyActiveLanguage,
        setCurrentlyActiveLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
