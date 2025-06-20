"use client";

import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
    setShowSidebar((prev) => !prev);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (showSidebar) {
      html.classList.add("lock-scroll");
    } else {
      html.classList.remove("lock-scroll");
    }

    return () => {
      html.classList.remove("lock-scroll");
    };
  }, [showSidebar]);

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
