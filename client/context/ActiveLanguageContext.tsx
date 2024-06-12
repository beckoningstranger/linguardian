"use client";

import { SupportedLanguage } from "@/types";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ActiveLanguageContext {
  activeLanguage: SupportedLanguage;
  setActiveLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
}

const ActiveLanguageContext = createContext<ActiveLanguageContext>({
  activeLanguage: "FR",
  setActiveLanguage: () => "FR",
});

export const ActiveLanguageProvider = ({
  activeLanguage: initialActiveLanguage,
  children,
}: PropsWithChildren<{ activeLanguage: SupportedLanguage }>) => {
  const [activeLanguage, setActiveLanguage] = useState(initialActiveLanguage);

  return (
    <ActiveLanguageContext.Provider
      value={{ activeLanguage, setActiveLanguage }}
    >
      {children}
    </ActiveLanguageContext.Provider>
  );
};

export const useActiveLanguage = () => {
  return useContext(ActiveLanguageContext);
};
