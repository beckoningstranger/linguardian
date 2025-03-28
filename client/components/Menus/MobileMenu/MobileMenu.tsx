"use client";
import Logo from "@/components/Logo";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const { showMobileMenu, toggleMobileMenu } = useMobileMenu();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");

    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  if (showMobileMenu && toggleMobileMenu && ref.current) {
    return createPortal(
      <div
        className={`fixed w-full z-50 overflow-hidden backdrop-blur-xl ${fromDirection} ${
          mode === "keyboard"
            ? "bottom-0 h-1/3 border-t border-t-black"
            : "top-0 h-full"
        }`}
      >
        {mode !== "keyboard" && (
          <div className="pt-4" onClick={() => toggleMobileMenu()}>
            <div className="flex w-screen cursor-pointer justify-center font-serif text-xl text-blue-800">
              Back to
            </div>
            <Logo mobileMenu />
          </div>
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
