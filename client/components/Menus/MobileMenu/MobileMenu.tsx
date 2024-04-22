"use client";
import {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Logo from "@/components/Logo";
import MobileMenuCloseButton from "./MobileMenuCloseButton";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";

interface MobileMenuProps {
  children: ReactNode;
  fromDirection?:
    | "animate-from-top"
    | "animate-from-right"
    | "animate-from-left"
    | "animate-from-bottom";
}

export default function MobileMenu({
  children,
  fromDirection = "animate-from-top",
}: MobileMenuProps) {
  const ref = useRef<Element | null>(null);
  const { showMobileMenu, toggleMobileMenu } = useMobileMenuContext();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");
  }, [showMobileMenu]);

  if (
    typeof window === "object" &&
    showMobileMenu &&
    toggleMobileMenu &&
    ref.current
  ) {
    return createPortal(
      // This returns a logo at the top, options (passed as children) in the middle and a button to close the menu at the bottom

      <div className="absolute top-0 h-full w-full backdrop-blur-md">
        <div
          className={
            "flex flex-col items-center justify-center gap-3 overflow-hidden " +
            fromDirection
          }
        >
          <Logo />
          <div className="mt-10 flex flex-col justify-center">{children}</div>
          <div onClick={toggleMobileMenu as MouseEventHandler}>
            <MobileMenuCloseButton />
          </div>
        </div>
      </div>,
      document.querySelector("#PortalOutlet") as HTMLElement
    );
  }
}
