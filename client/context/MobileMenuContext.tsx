"use client";

import { Logo } from "@/components";
import { Button } from "@headlessui/react";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type MobileMenuContextType = {
  showMobileMenu: boolean;
  openMobileMenu: (content: ReactNode) => void;
  closeMobileMenu: () => void;
  setMobileMenuContent: (content: ReactNode) => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
  undefined
);

export function MobileMenuContextProvider({ children }: PropsWithChildren) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuContent, setMobileMenuContent] = useState<ReactNode>(null);

  const openMobileMenu = (content: ReactNode) => {
    setMobileMenuContent(content);
    setShowMobileMenu(true);
  };
  const closeMobileMenu = () => setShowMobileMenu(false);

  useEffect(() => {
    if (!showMobileMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showMobileMenu]);

  const value = useMemo(
    () => ({
      showMobileMenu,
      openMobileMenu,
      closeMobileMenu,
      setMobileMenuContent,
    }),
    [showMobileMenu]
  );

  return (
    <MobileMenuContext.Provider value={value}>
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex animate-from-top flex-col gap-8 bg-white/95">
          <Button onClick={closeMobileMenu} className="w-full text-center">
            <div className="mt-2 font-serif text-hmd text-blue-800">
              Back to
            </div>
            <Logo mobileMenu />
          </Button>

          {mobileMenuContent}
        </div>
      )}
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) {
    throw new Error(
      "useMobileMenu must be used within MobileMenuContextProvider"
    );
  }
  return ctx;
}
