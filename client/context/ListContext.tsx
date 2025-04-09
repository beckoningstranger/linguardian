"use client";

import {
  LearningDataForLanguage,
  LearningMode,
  ListStats,
  ListStatus,
  PopulatedList,
} from "@/lib/types";
import { ReactNode, createContext, useContext } from "react";

type ListContext = {
  userIsAuthor: boolean;
  userIsLearningThisList: boolean;
  userIsLearningListLanguage: boolean;
  listData: PopulatedList;
  authorData: {
    username: string;
    usernameSlug: string;
  }[];
  learningDataForLanguage: LearningDataForLanguage | undefined;
  unlockedLearningModesForUser: LearningMode[];
  listStats: ListStats;
  listStatus: ListStatus;
};

const ListContext = createContext<ListContext>({
  userIsAuthor: false,
  userIsLearningListLanguage: false,
  userIsLearningThisList: false,
  listData: {} as PopulatedList,
  authorData: [],
  learningDataForLanguage: undefined,
  unlockedLearningModesForUser: [],
  listStats: {} as ListStats,
  listStatus: "add",
});

type ListContextProviderProps = Omit<
  ListContext,
  "setUserIsLearningThisList"
> & {
  children: ReactNode;
};

export const ListContextProvider = ({
  children,
  userIsAuthor,
  userIsLearningListLanguage,
  userIsLearningThisList,
  listData,
  authorData,
  learningDataForLanguage,
  unlockedLearningModesForUser,
  listStats,
  listStatus,
}: ListContextProviderProps) => {
  return (
    <ListContext.Provider
      value={{
        userIsAuthor,
        userIsLearningListLanguage,
        userIsLearningThisList,
        listData,
        authorData,
        learningDataForLanguage,
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
