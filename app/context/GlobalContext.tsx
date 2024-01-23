"use client";
import {
  MouseEventHandler,
  PropsWithChildren,
  createContext,
  useState,
} from "react";

type GlobalContextType = {
  showSidebar: Boolean;
  toggleSidebar?: MouseEventHandler;
};

export const GlobalContext = createContext<GlobalContextType>({
  showSidebar: false,
});

export function GlobalContextProvider({ children }: PropsWithChildren) {
  const [showSidebar, setShowSideBar] = useState(false);

  function toggleSidebar() {
    setShowSideBar((topMenuOpen) => !topMenuOpen);
  }

  return (
    <GlobalContext.Provider value={{ showSidebar, toggleSidebar }}>
      {children}
    </GlobalContext.Provider>
  );
}
