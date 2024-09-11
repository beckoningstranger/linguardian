"use client";

import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";

import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import MobileMenu from "../MobileMenu/MobileMenu";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";
import UserMenu from "./UserMenu";

interface LanguageSelectorAndUserMenuProps {
  activeLanguageData: { name: SupportedLanguage; flag: string };
  setCurrentlyActiveLanguage: Function;
  allSupportedLanguages: SupportedLanguage[];
  user: SessionUser;
}

export default function LanguageSelectorAndUserMenu({
  activeLanguageData,
  setCurrentlyActiveLanguage,
  allSupportedLanguages,
  user,
}: LanguageSelectorAndUserMenuProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const currentBaseUrl = usePathname();
  const showLanguageSelectorOnlyOn: string[] = [];

  allSupportedLanguages.forEach((lang) => {
    ["dashboard", "dictionary", "lists", "lists/new"].forEach((entry) =>
      showLanguageSelectorOnlyOn.push("/" + lang + "/" + entry)
    );
  });

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
          code={activeLanguageData.flag}
          className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
          onClick={toggleMobileMenu as MouseEventHandler}
        />
        <MobileMenu fromDirection="animate-from-top">
          <MobileLanguageSelector
            setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
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
            setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
            activeLanguageData={activeLanguageData}
            allSupportedLanguages={allSupportedLanguages}
            user={user}
          />
        </div>
        <MobileMenuContextProvider>
          <UserMenu />
        </MobileMenuContextProvider>
      </div>
    </>
  );
}
