"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type MobileMenuContextType = {
  showMobileMenu: boolean;
  toggleMobileMenu?: Function;
};

export const MobileMenuContext = createContext<MobileMenuContextType>({
  showMobileMenu: false,
});

export function MobileMenuContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  function toggleMobileMenu(arg?: boolean) {
    if (arg !== undefined) {
      setShowMobileMenu(arg);
      return;
    }
    setShowMobileMenu((active) => !active);
  }

  return (
    <MobileMenuContext.Provider
      value={{
        showMobileMenu,
        toggleMobileMenu,
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context)
    throw new Error("MobileMenuContext was used outside of its provider!");
  return context;
}
