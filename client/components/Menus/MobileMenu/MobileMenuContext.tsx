"use client";
import { PropsWithChildren, createContext, useState } from "react";

type MobileMenuContextType = {
  showMobileMenu: Boolean;
  toggleMobileMenu?: Function;
};

export const MobileMenuContext = createContext<MobileMenuContextType>({
  showMobileMenu: false,
});

export function MobileMenuContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  function toggleMobileMenu() {
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
