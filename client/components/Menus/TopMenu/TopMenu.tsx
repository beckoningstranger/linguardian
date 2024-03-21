"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { LanguageFeatures, SupportedLanguage, User } from "@/types";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import LanguageSelectorAndUserMenu from "./LanguageSelectorAndUserMenu";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";
import TopMiddleNavigation from "./TopMiddleNavigation";
import HamburgerMenu from "./HamburgerMenu";
import TopMenuLogo from "./TopMenuLogo";

interface TopMenuProps {
  user: User;
  allSupportedLanguages: SupportedLanguage[];
  allLanguageFeatures: LanguageFeatures[];
}

export default function TopMenu({
  user,
  allSupportedLanguages,
  allLanguageFeatures,
}: TopMenuProps) {
  const searchParams = useSearchParams();
  const passedLanguage = searchParams.get("lang");
  const checkedPassedLanguage = checkPassedLanguageSync(
    passedLanguage,
    allSupportedLanguages
  );

  const languageAndFlag = getLanguageAndFlag(
    user,
    checkedPassedLanguage,
    allLanguageFeatures
  );

  const [currentlyActiveLanguage, setCurrentlyActiveLanguage] = useState(
    languageAndFlag.lang as SupportedLanguage
  );

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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
              languageAndFlag={languageAndFlag}
              user={user}
              setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
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
  user: User,
  language: SupportedLanguage | false,
  allLanguageFeatures: LanguageFeatures[]
) {
  const failSafeResponse = {
    lang: user.languages[0].code,
    flag: user.languages[0].flag,
  };
  if (!language) {
    return failSafeResponse;
  }
  const [langFeaturesForPassedLanguage] = allLanguageFeatures.filter(
    (langFeat) => langFeat.langCode === language
  );

  return {
    lang: langFeaturesForPassedLanguage?.langCode,
    flag: langFeaturesForPassedLanguage?.flagCode,
  };
}
