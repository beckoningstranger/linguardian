"use client";
import { useContext } from "react";
import { MobileMenuContext } from "@/components/Menus/MobileMenu/MobileMenuContext";

export default function useMobileMenuContext() {
  const context = useContext(MobileMenuContext);
  if (context === undefined)
    throw new Error("Mobile Menu Context was used outside of MobileMenuContextProvider");
  return context;
}
