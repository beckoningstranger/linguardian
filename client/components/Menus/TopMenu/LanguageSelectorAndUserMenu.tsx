"use client";

import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";

import MobileMenu from "../MobileMenu/MobileMenu";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import UserMenu from "./UserMenu";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { SupportedLanguage, User } from "@/types";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";

interface LanguageSelectorAndUserMenuProps {
  activeLanguageData: { name: SupportedLanguage; flag: string };
  user: User;
  setCurrentlyActiveLanguage: Function;
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelectorAndUserMenu({
  activeLanguageData,
  user,
  setCurrentlyActiveLanguage,
  allSupportedLanguages,
}: LanguageSelectorAndUserMenuProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const currentBaseUrl = usePathname();
  const showLanguageSelectorOnlyOn: string[] = [];

  allSupportedLanguages.forEach((lang) => {
    ["dashboard", "dictionary", "lists"].forEach((entry) =>
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
            user={user}
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
            user={user}
            allSupportedLanguages={allSupportedLanguages}
          />
        </div>
        <MobileMenuContextProvider>
          <UserMenu user={user} />
        </MobileMenuContextProvider>
      </div>
    </>
  );
}
