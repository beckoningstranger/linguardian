"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LanguageWithFlagAndName, User } from "@/lib/contracts";

interface UserContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  activeLanguage: LanguageWithFlagAndName | null;
  setActiveLanguage: Dispatch<SetStateAction<LanguageWithFlagAndName | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

type UserContextProviderProps = {
  children: ReactNode;
  initialUser?: User | null;
  initialActiveLanguage?: LanguageWithFlagAndName | null;
};

export const UserContextProvider = ({
  children,
  initialUser = null,
  initialActiveLanguage = null,
}: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);

  const [activeLanguage, setActiveLanguage] =
    useState<LanguageWithFlagAndName | null>(initialActiveLanguage);

  useEffect(() => {
    setUser(initialUser ?? null);
  }, [initialUser]);

  useEffect(() => {
    setActiveLanguage(initialActiveLanguage ?? null);
  }, [initialActiveLanguage]);

  const contextValue = useMemo(
    () => ({ user, setUser, activeLanguage, setActiveLanguage }),
    [user, activeLanguage]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within its provider!");
  }
  return context;
};
