"use client";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import { RxCrossCircled } from "react-icons/rx";
import useGlobalContext from "@/app/hooks/useGlobalContext";

interface MobileMenuProps {
  children: ReactNode[];
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const ref = useRef<Element | null>(null);
  const { showMobileMenu, toggleMobileMenuOff } = useGlobalContext();

  console.log(children!.length);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("#PortalOutlet");
  }, [showMobileMenu]);

  if (typeof window === "object" && showMobileMenu) {
    return ref.current
      ? createPortal(
          <div className="absolute flex flex-col justify-center items-center w-full h-full  backdrop-blur-md">
            <div className="flex flex-col gap-3 items-center justify-center animate-fold-out overflow-hidden">
            {children!.length < 4 && <Logo />}
              {children}
              <RxCrossCircled
                className="self-center my-4 text-6xl text-slate-600"
                onClick={() => toggleMobileMenuOff!()}
              />
            </div>
          </div>,
          document.querySelector("#PortalOutlet") as HTMLElement
        )
      : null;
  }
}
