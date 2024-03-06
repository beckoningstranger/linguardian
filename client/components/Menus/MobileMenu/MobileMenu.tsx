"use client";
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Logo from "../../Logo";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import MobileMenuCloseButton from "./MobileMenuCloseButton";

interface MobileMenuProps {
  children: ReactNode;
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const ref = useRef<Element | null>(null);
  const { showMobileMenu, toggleMobileMenu } = useGlobalContext();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");
  }, [showMobileMenu]);

  if (typeof window === "object" && showMobileMenu && toggleMobileMenu) {
    return ref.current
      ? createPortal(
          // This returns a logo at the top, options (passed as children) in the middle and a button to close the menu at the bottom

          <div className="absolute top-0 h-full w-full backdrop-blur-md">
            <div className="flex animate-fold-out flex-col items-center justify-center gap-3 overflow-hidden">
              <Logo />
              <div className="flex flex-col justify-center">{children}</div>
              <div onClick={toggleMobileMenu as MouseEventHandler}>
                <MobileMenuCloseButton />
              </div>
            </div>
          </div>,
          document.querySelector("#PortalOutlet") as HTMLElement
        )
      : null;
  }
}
