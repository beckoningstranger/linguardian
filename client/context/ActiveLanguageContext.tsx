"use client";

import CenteredSpinner from "@/components/CenteredSpinner";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
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
  setActiveLanguage: () => {},
});

export const ActiveLanguageProvider = ({ children }: PropsWithChildren) => {
  const { data, status } = useSession();
  const sessionUser = data?.user as SessionUser;
  const initialLanguage = sessionUser?.isLearning?.[0]?.name || "FR"; // Fallback to "FR" if isLearning is undefined
  const [activeLanguage, setActiveLanguage] =
    useState<SupportedLanguage>(initialLanguage);

  return status === "authenticated" ? (
    <ActiveLanguageContext.Provider
      value={{ activeLanguage, setActiveLanguage }}
    >
      {children}
    </ActiveLanguageContext.Provider>
  ) : (
    <CenteredSpinner />
  );
};

export const useActiveLanguage = () => {
  const context = useContext(ActiveLanguageContext);
  if (!context)
    throw new Error("ActiveLanguageContext was used outside of its provider!");
  return context;
};
