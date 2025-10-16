"use client";

import { LanguageWithFlagAndName } from "@/lib/contracts";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type UnitContext = {
  unitName: string;
  unitNumber: number;
  noOfItemsInUnit: number;
  listName: string;
  listNumber: number;
  listLanguage: LanguageWithFlagAndName;
  unitOrder: string[];
  showAddItemDialog: boolean;
  setShowAddItemDialog: Dispatch<SetStateAction<boolean>>;
};

const UnitContext = createContext<UnitContext | undefined>(undefined);

type UnitContextProviderProps = Partial<UnitContext> & {
  children: ReactNode;
};

export const UnitContextProvider = ({
  children,
  unitName = "",
  unitNumber = 0,
  noOfItemsInUnit = 0,
  listName = "",
  listNumber = 0,
  listLanguage = {} as LanguageWithFlagAndName,
  unitOrder = [],
}: UnitContextProviderProps) => {
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  return (
    <UnitContext.Provider
      value={{
        unitOrder,
        unitName,
        unitNumber,
        noOfItemsInUnit,
        listName,
        listNumber,
        listLanguage,
        showAddItemDialog,
        setShowAddItemDialog,
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
  return context;
};

export const useOptionalUnitContext = () => useContext(UnitContext);
