"use client";

import { ReactNode, createContext, useContext } from "react";

type UnitContext = {
  unitName: string;
  noOfItemsInUnit: number;
};

const UnitContext = createContext<UnitContext>({
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
  unitName,
  noOfItemsInUnit,
}: UnitContextProviderProps) => {
  return (
    <UnitContext.Provider
      value={{
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
