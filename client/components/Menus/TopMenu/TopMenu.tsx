"use client";
import { useEffect, useState } from "react";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { LanguageFeatures, SupportedLanguage } from "@/types";
import { useSession } from "next-auth/react";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";
import HamburgerMenu from "./HamburgerMenu";
import LanguageSelectorAndUserMenu from "./LanguageSelectorAndUserMenu";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import TopMenuLogo from "./TopMenuLogo";
import TopMiddleNavigation from "./TopMiddleNavigation";

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
  const sessionUser = useSession().data?.user;

  useEffect(() => {
    setActiveLanguage(sessionUser.isLearning[0].name);
  }, [setActiveLanguage, sessionUser]);

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
