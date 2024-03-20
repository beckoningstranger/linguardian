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

interface LanguageSelectorAndUserMenuProps {
  languageAndFlag: { lang: SupportedLanguage; flag: string };
  user: User;
  setCurrentlyActiveLanguage: Function;
}

export default function LanguageSelectorAndUserMenu({
  languageAndFlag,
  user,
  setCurrentlyActiveLanguage,
}: LanguageSelectorAndUserMenuProps) {
  const { toggleMobileMenu } = useMobileMenuContext();

  const currentBaseUrl = usePathname();
  const showLanguageSelectorOnlyOn = [
    "/app/dashboard",
    "/app/dictionary",
    "/app/lists",
  ];

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
          code={languageAndFlag.flag}
          className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
          onClick={toggleMobileMenu as MouseEventHandler}
        />
        <MobileMenu>
          <MobileLanguageSelector
            user={user}
            setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
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
            languageAndFlag={languageAndFlag}
            user={user}
          />
        </div>

        <UserMenu />
      </div>
    </>
  );
}
