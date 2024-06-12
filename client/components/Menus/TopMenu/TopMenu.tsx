"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { LanguageFeatures, SupportedLanguage, User } from "@/types";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import LanguageSelectorAndUserMenu from "./LanguageSelectorAndUserMenu";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";
import TopMiddleNavigation from "./TopMiddleNavigation";
import HamburgerMenu from "./HamburgerMenu";
import TopMenuLogo from "./TopMenuLogo";

interface TopMenuProps {
  allSupportedLanguages: SupportedLanguage[];
  allLanguageFeatures: LanguageFeatures[];
  language: SupportedLanguage;
}

export default function TopMenu({
  allSupportedLanguages,
  allLanguageFeatures,
  language,
}: TopMenuProps) {
  const activeLanguageData = getLanguageAndFlag(language, allLanguageFeatures);
  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] =
    useState(language);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const currentBaseUrl = usePathname();

  allSupportedLanguages.forEach((lang) => {
    if (currentBaseUrl.includes(lang) && lang !== currentlyActiveLanguage) {
      setCurrentlyActiveLanguage(lang);
    }
  });

  return (
    <>
      <header>
        <SideBarNavigation
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
          currentlyActiveLanguage={currentlyActiveLanguage}
        />
        <div className="absolute top-0 flex h-20 w-full select-none items-center justify-between bg-slate-300 bg-opacity-25 text-xl">
          <div className={"flex items-center"}>
            <HamburgerMenu toggleSidebar={toggleSidebar} />
            <TopMenuLogo language={currentlyActiveLanguage} />
          </div>
          <TopMiddleNavigation language={currentlyActiveLanguage} />
          <MobileMenuContextProvider>
            <LanguageSelectorAndUserMenu
              activeLanguageData={activeLanguageData}
              setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
              allSupportedLanguages={allSupportedLanguages}
            />
          </MobileMenuContextProvider>
        </div>
      </header>
    </>
  );
}

export function checkPassedLanguageSync(
  passedLanguage: string | null,
  supportedLanguages: SupportedLanguage[]
) {
  if (
    !passedLanguage ||
    !supportedLanguages ||
    !supportedLanguages.includes(passedLanguage as SupportedLanguage)
  ) {
    return false;
  }
  return passedLanguage as SupportedLanguage;
}

export function getLanguageAndFlag(
  language: SupportedLanguage | false,
  allLanguageFeatures: LanguageFeatures[]
) {
  const [langFeaturesForPassedLanguage] = allLanguageFeatures.filter(
    (langFeat) => langFeat.langCode === language
  );

  return {
    name: langFeaturesForPassedLanguage?.langCode,
    flag: langFeaturesForPassedLanguage?.flagCode,
  };
}
