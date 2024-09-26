"use client";

import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { SupportedLanguage } from "@/lib/types";
import {
  MobileMenuContextProvider,
  useMobileMenu,
} from "../../../context/MobileMenuContext";
import MobileMenu from "../MobileMenu/MobileMenu";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";
import UserMenu from "./UserMenu";

interface LanguageSelectorAndUserMenuProps {
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelectorAndUserMenu({
  allSupportedLanguages,
}: LanguageSelectorAndUserMenuProps) {
  const { toggleMobileMenu } = useMobileMenu();
  const currentBaseUrl = usePathname();
  const { activeLanguage } = useActiveLanguage();

  const showLanguageSelectorOnlyOn: string[] = [];
  allSupportedLanguages.forEach((lang) => {
    ["dashboard", "dictionary", "lists", "lists/new"].forEach((entry) =>
      showLanguageSelectorOnlyOn.push("/" + lang + "/" + entry)
    );
  });

  if (activeLanguage)
    return (
      <>
        <div
          className={
            !showLanguageSelectorOnlyOn.includes(currentBaseUrl)
              ? "hidden"
              : undefined
          }
        >
          <Flag
            code={activeLanguage.flag}
            className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
            onClick={toggleMobileMenu as MouseEventHandler}
          />
          <MobileMenu fromDirection="animate-from-top">
            <MobileLanguageSelector
              allSupportedLanguages={allSupportedLanguages}
            />
          </MobileMenu>
        </div>
        <div className="flex h-20 items-center justify-evenly">
          <div
            className={`${
              !showLanguageSelectorOnlyOn.includes(currentBaseUrl) && "hidden"
            } z-50`}
          >
            <LanguageSelector
              activeLanguage={activeLanguage}
              allSupportedLanguages={allSupportedLanguages}
            />
          </div>
          <MobileMenuContextProvider>
            <UserMenu />
          </MobileMenuContextProvider>
        </div>
      </>
    );
}
