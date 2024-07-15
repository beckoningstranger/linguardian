"use client";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LogoWithCloseButton from "../LogoWithCloseButton";

interface MobileMenuProps {
  children: ReactNode;
  fromDirection?:
    | "animate-from-top"
    | "animate-from-right"
    | "animate-from-left"
    | "animate-from-bottom";
  mode?: "fullscreen" | "keyboard";
}

export default function MobileMenu({
  children,
  fromDirection = "animate-from-top",
  mode,
}: MobileMenuProps) {
  const ref = useRef<Element | null>(null);
  const { showMobileMenu, toggleMobileMenu } = useMobileMenuContext();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");
  }, [showMobileMenu]);

  if (showMobileMenu && toggleMobileMenu && ref.current) {
    return createPortal(
      <div
        className={`absolute w-full overflow-hidden backdrop-blur-md ${fromDirection} ${
          mode === "keyboard"
            ? "bottom-0 h-1/3 border-t border-t-black"
            : "top-0 h-full"
        }`}
      >
        {mode !== "keyboard" && (
          <LogoWithCloseButton
            toggleFunction={toggleMobileMenu as MouseEventHandler}
          />
        )}
        <div
          className={`h-full  
            ${mode === "keyboard" ? "" : "flex flex-col items-center mt-20"}`}
        >
          {children}
        </div>
      </div>,
      document.querySelector("#PortalOutlet") as HTMLElement
    );
  }
}
