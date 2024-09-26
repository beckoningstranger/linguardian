"use client";

import { LanguageWithFlag, SessionUser } from "@/lib/types";
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
  activeLanguage: LanguageWithFlag | null;
  setActiveLanguage: Dispatch<SetStateAction<LanguageWithFlag | null>>;
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
  const sessionUser = data?.user as SessionUser;
  const [activeLanguage, setActiveLanguage] = useState<LanguageWithFlag | null>(
    sessionUser?.activeLanguageAndFlag
  );
  const contextValue = useMemo(
    () => ({ activeLanguage, setActiveLanguage }),
    [activeLanguage]
  );

  useEffect(() => {
    if (sessionUser?.activeLanguageAndFlag)
      setActiveLanguage(sessionUser.activeLanguageAndFlag);
  }, [sessionUser]);

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
