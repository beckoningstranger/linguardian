"use client";

import {
  FullyPopulatedList,
  LearningDataForLanguage,
  LearningMode,
  ListStats,
  ListStatus,
} from "@/lib/types";
import { ReactNode, createContext, useContext } from "react";

type UnitContext = {
  //   userIsAuthor: boolean;
  //   userIsLearningThisList: boolean;
  //   listData: FullyPopulatedList;
  //   learningDataForLanguage: LearningDataForLanguage | undefined;
  //   unlockedLearningModesForUser: LearningMode[];
  //   listStats: ListStats;
  //   listStatus: ListStatus;
  unitName: string;
  noOfItemsInUnit: number;
};

const UnitContext = createContext<UnitContext>({
  //   userIsAuthor: false,
  //   userIsLearningThisList: false,
  //   listData: {} as FullyPopulatedList,
  //   learningDataForLanguage: undefined,
  //   unlockedLearningModesForUser: [],
  //   listStats: {} as ListStats,
  //   listStatus: "add",
  unitName: "",
  noOfItemsInUnit: 0,
});

type UnitContextProviderProps = Omit<
  UnitContext,
  "setUserIsLearningThisUnit"
> & {
  children: ReactNode;
};

export const UnitContextProvider = ({
  children,
  //   userIsAuthor,
  //   userIsLearningThisList,
  //   listData,
  //   learningDataForLanguage,
  //   unlockedLearningModesForUser,
  //   listStats,
  //   listStatus,
  unitName,
  noOfItemsInUnit,
}: UnitContextProviderProps) => {
  return (
    <UnitContext.Provider
      value={{
        // userIsAuthor,
        // userIsLearningThisList,
        // listData,
        // learningDataForLanguage,
        // unlockedLearningModesForUser,
        // listStats,
        // listStatus,
        unitName,
        noOfItemsInUnit,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export const useUnitContext = () => {
  const context = useContext(UnitContext);
  if (!context)
    throw new Error("UnitContext was used outside of its provider!");
  return useContext(UnitContext);
};
