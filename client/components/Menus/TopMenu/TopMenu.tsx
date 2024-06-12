"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { LanguageFeatures, SupportedLanguage } from "@/types";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import LanguageSelectorAndUserMenu from "./LanguageSelectorAndUserMenu";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";
import TopMiddleNavigation from "./TopMiddleNavigation";
import HamburgerMenu from "./HamburgerMenu";
import TopMenuLogo from "./TopMenuLogo";
import { useActiveLanguage } from "@/context/ActiveLanguageContext";

interface TopMenuProps {
  allSupportedLanguages: SupportedLanguage[];
  allLanguageFeatures: LanguageFeatures[];
}

export default function TopMenu({
  allSupportedLanguages,
  allLanguageFeatures,
}: TopMenuProps) {
  const { activeLanguage, setActiveLanguage } = useActiveLanguage();
  if (!activeLanguage) throw new Error("ActiveLanguage is not set");
  const activeLanguageData = getLanguageAndFlag(
    activeLanguage,
    allLanguageFeatures
  );
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const currentBaseUrl = usePathname();

  useEffect(() => {
    allSupportedLanguages.forEach((lang) => {
      if (currentBaseUrl.includes(lang) && lang !== activeLanguage) {
        setActiveLanguage(lang);
      }
    });
  }, [
    currentBaseUrl,
    allSupportedLanguages,
    setActiveLanguage,
    activeLanguage,
  ]);

  return (
    <>
      <header>
        <SideBarNavigation
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
          currentlyActiveLanguage={activeLanguage}
        />
        <div className="absolute top-0 flex h-20 w-full select-none items-center justify-between bg-slate-300 bg-opacity-25 text-xl">
          <div className={"flex items-center"}>
            <HamburgerMenu toggleSidebar={toggleSidebar} />
            <TopMenuLogo language={activeLanguage} />
          </div>
          <TopMiddleNavigation language={activeLanguage} />
          <MobileMenuContextProvider>
            <LanguageSelectorAndUserMenu
              activeLanguageData={activeLanguageData}
              setCurrentlyActiveLanguage={setActiveLanguage}
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
  language: SupportedLanguage,
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
