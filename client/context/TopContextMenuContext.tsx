"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface TopContextMenuContextProps {
  showTopContextMenu: boolean;
  setShowTopContextMenu: Dispatch<SetStateAction<boolean>>;
  // add more stuff here
}

const TopContextMenuContext = createContext<
  TopContextMenuContextProps | undefined
>(undefined);

type TopContextMenuContextProviderProps = {
  children: ReactNode;
};

export const TopContextMenuContextProvider = ({
  children,
}: // add more stuff here
TopContextMenuContextProviderProps) => {
  const [showTopContextMenu, setShowTopContextMenu] = useState(false);

  return (
    <TopContextMenuContext.Provider
      value={{
        showTopContextMenu,
        setShowTopContextMenu,
        // and pull it out here
      }}
    >
      {children}
    </TopContextMenuContext.Provider>
  );
};

export function useTopContextMenu() {
  const context = useContext(TopContextMenuContext);
  if (!context) {
    throw new Error("TopContextMenuContext must be used within its provider!");
  }
  return context;
}
