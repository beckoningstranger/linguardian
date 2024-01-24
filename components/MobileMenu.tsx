"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import { RxCrossCircled } from "react-icons/rx";
import useGlobalContext from "@/app/hooks/useGlobalContext";

interface MobileMenuProps {
  children: ReactNode;
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const ref = useRef<Element | null>(null);
  const { showMobileMenu, toggleMobileMenuOff } = useGlobalContext();

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");
  }, [showMobileMenu]);

  if (typeof window === "object" && showMobileMenu) {
    return ref.current
      ? createPortal(
          <div className="absolute flex flex-col justify-center w-full h-full -translate-y-1/2 top-1/2 backdrop-blur-md">
            {/* <Logo /> */}
            {children}
            <RxCrossCircled
              className="self-center my-4 text-5xl text-slate-600"
              onClick={() => toggleMobileMenuOff!()}
            />
          </div>,
          document.querySelector("#PortalOutlet") as HTMLElement
        )
      : null;
  }
}
