"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import Logo from "@/components/Logo";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { cn } from "@/lib/utils";
import { Button } from "@headlessui/react";

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
    document.body.style.overflow = showMobileMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  if (showMobileMenu && toggleMobileMenu && ref.current) {
    return createPortal(
      <div
        className={cn(
          "fixed w-full z-50 overflow-hidden backdrop-blur-xl",
          fromDirection,
          mode === "keyboard"
            ? "IPAKeyboard bottom-0 h-1/3 border-t border-t-black" // IPAKeyboard class is needed to useOutsideClick
            : "top-0 h-full"
        )}
      >
        {mode !== "keyboard" && (
          <Button onClick={() => toggleMobileMenu()} className="text-center">
            <div className="mt-2 w-screen text-center font-serif text-hmd text-blue-800">
              Back to
            </div>
            <Logo mobileMenu />
          </Button>
        )}
        <div
          className={`h-full  
            ${mode === "keyboard" ? "" : "flex flex-col items-center mt-8"}`}
        >
          {children}
        </div>
      </div>,
      document.querySelector("#PortalOutlet") as HTMLElement
    );
  }
}
