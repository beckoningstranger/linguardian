"use client";

import {
  LearningData,
  LearningMode,
  ListStats,
  ListStatus,
  PopulatedList,
} from "@/lib/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ListContext = {
  userIsAuthor: boolean;
  listData: PopulatedList;
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
  setUserIsLearningThisList: Dispatch<SetStateAction<boolean>>;
};

const ListContext = createContext<ListContext>({
  userIsAuthor: false,
  listData: {} as PopulatedList,
  authorData: [],
  userIsLearningThisList: false,
  setUserIsLearningThisList: () => {},
  listLanguageName: "",
  learningDataForUser: undefined,
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
  listData,
  authorData,
  userIsLearningThisList: initialUserIsLearning,
  listLanguageName,
  learningDataForUser,
  unlockedLearningModesForUser,
  listStats,
  listStatus,
}: ListContextProviderProps) => {
  const [userIsLearningThisList, setUserIsLearningThisList] = useState(
    initialUserIsLearning
  );
  return (
    <ListContext.Provider
      value={{
        userIsAuthor,
        listData,
        authorData,
        userIsLearningThisList,
        setUserIsLearningThisList,
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
