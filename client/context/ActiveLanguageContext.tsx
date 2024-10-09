"use client";

import { LanguageWithFlagAndName, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ActiveLanguageContext {
  activeLanguage: LanguageWithFlagAndName | null;
  setActiveLanguage: Dispatch<SetStateAction<LanguageWithFlagAndName | null>>;
}

const ActiveLanguageContext = createContext<ActiveLanguageContext>({
  activeLanguage: null,
  setActiveLanguage: () => {},
});

type ActiveLanguageProviderProps = {
  children: ReactNode;
};

export const ActiveLanguageProvider = ({
  children,
}: ActiveLanguageProviderProps) => {
  const { data, status } = useSession();
  const user = data?.user as User;
  const [activeLanguage, setActiveLanguage] =
    useState<LanguageWithFlagAndName | null>(
      user?.activeLanguageAndFlag ? user.activeLanguageAndFlag : null
    );
  const contextValue = useMemo(
    () => ({ activeLanguage, setActiveLanguage }),
    [activeLanguage]
  );

  useEffect(() => {
    if (user?.activeLanguageAndFlag)
      setActiveLanguage(user.activeLanguageAndFlag);
  }, [user]);

  return status === "authenticated" ? (
    <ActiveLanguageContext.Provider value={contextValue}>
      {children}
    </ActiveLanguageContext.Provider>
  ) : null;
};

export const useActiveLanguage = () => {
  const context = useContext(ActiveLanguageContext);
  if (!context) {
    throw new Error("ActiveLanguageContext must be used within its provider!");
  }
  return context;
};
