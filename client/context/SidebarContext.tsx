"use client";

import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface SidebarContext {
  showSidebar: boolean;
  toggleSidebar: () => void;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContext>({
  showSidebar: false,
  toggleSidebar: () => {},
  setShowSidebar: () => {},
});

export const SidebarContextProvider = ({ children }: PropsWithChildren) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = useCallback(() => {
    setShowSidebar((prev) => {
      document.body.style.position = prev ? "" : "fixed";
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
      return !prev;
    });
  }, []);

  return (
    <SidebarContext.Provider
      value={{ showSidebar, toggleSidebar, setShowSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("SidebarContext was used outside of its provider!");
  return useContext(SidebarContext);
};
