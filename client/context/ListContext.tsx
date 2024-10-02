"use client";

import {
  LearnedItem,
  LearningData,
  LearningMode,
  ListStats,
  ListStatus,
  PopulatedList,
} from "@/lib/types";
import { ReactNode, createContext, useContext } from "react";

interface ListContext {
  userIsAuthor: boolean;
  listData: PopulatedList;
  learnedItemsForListLanguage: LearnedItem[] | undefined; // ??
  authorData: {
    username: string;
    usernameSlug: string;
  }[];
  userIsLearningThisList: boolean;
  listLanguageName: string;
  learningDataForUser: LearningData | undefined;
  unlockedLearningModesForUser: LearningMode[];
  listStats: ListStats;
  listStatus: ListStatus;
}

const ListContext = createContext<ListContext>({
  userIsAuthor: false,
  listData: {} as PopulatedList,
  learnedItemsForListLanguage: [], // ???? get from learningData!
  authorData: [],
  userIsLearningThisList: false,
  listLanguageName: "",
  learningDataForUser: undefined,
  unlockedLearningModesForUser: [],
  listStats: {} as ListStats,
  listStatus: "review",
});

interface ListContextProviderProps {
  children: ReactNode;
  userIsAuthor: boolean;
  listData: PopulatedList;
  learnedItemsForListLanguage: LearnedItem[] | undefined; // ?????
  authorData: {
    username: string;
    usernameSlug: string;
  }[];
  userIsLearningThisList: boolean;
  listLanguageName: string;
  learningDataForUser: LearningData | undefined;
  unlockedLearningModesForUser: LearningMode[];
  listStats: ListStats;
  listStatus: ListStatus;
}

export const ListContextProvider = ({
  children,
  userIsAuthor,
  listData,
  learnedItemsForListLanguage, // ??
  authorData,
  userIsLearningThisList,
  listLanguageName,
  learningDataForUser,
  unlockedLearningModesForUser,
  listStats,
  listStatus,
}: ListContextProviderProps) => {
  return (
    <ListContext.Provider
      value={{
        userIsAuthor,
        listData,
        learnedItemsForListLanguage,
        authorData,
        userIsLearningThisList,
        listLanguageName,
        learningDataForUser,
        unlockedLearningModesForUser,
        listStats,
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
  return useContext(ListContext);
};
