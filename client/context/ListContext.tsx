"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import {
  AuthorData,
  LanguageWithFlagAndName,
  LearningMode,
  LearningStats,
  ListStatus,
  UnitInformation,
} from "@/lib/contracts";

type ListContext = {
  listImage: string;
  listDescription: string;
  listNumber: number;
  listLanguage: LanguageWithFlagAndName;
  listName: string;
  learningStats: LearningStats;
  userIsAuthor: boolean;
  userIsLearningThisList: boolean;
  userIsLearningListLanguage: boolean;
  authorData: AuthorData[];
  learnedItemIds: string[];
  ignoredItemIds: string[];
  unitInformation: UnitInformation;
  listStatus: ListStatus;
  unitOrder: string[];
  setUnitOrder: React.Dispatch<React.SetStateAction<string[]>>;
  initialUnitOrder: string[];
};

const ListContext = createContext<ListContext | undefined>(undefined);

type ListContextProviderProps = Partial<ListContext> & {
  children: ReactNode;
};

export const ListContextProvider = ({
  children,
  listImage = "",
  listNumber = 0,
  listLanguage = {} as LanguageWithFlagAndName,
  listDescription = "",
  listName = "",
  learningStats = {} as LearningStats,
  userIsAuthor = false,
  userIsLearningThisList = false,
  userIsLearningListLanguage = false,
  authorData = [],
  learnedItemIds = [],
  ignoredItemIds = [],
  unitInformation = [],
  listStatus = "add",
  initialUnitOrder = [],
}: ListContextProviderProps) => {
  const [unitOrder, setUnitOrder] = useState(initialUnitOrder);

  return (
    <ListContext.Provider
      value={{
        initialUnitOrder,
        unitOrder,
        setUnitOrder,
        listImage,
        listNumber,
        listLanguage,
        listDescription,
        listName,
        learningStats,
        userIsAuthor,
        userIsLearningThisList,
        userIsLearningListLanguage,
        authorData,
        learnedItemIds,
        ignoredItemIds,
        unitInformation,
        listStatus,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useListContext = () => {
  const context = useContext(ListContext);
  if (!context)
    throw new Error("ListContext was used outside of its provider!");
  return context;
};

export const useOptionalListContext = () => useContext(ListContext);
