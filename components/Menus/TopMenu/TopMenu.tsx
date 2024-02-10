"use client";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import UserMenu from "../UserMenu";
import HamburgerMenu from "./HamburgerMenu";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import { MouseEventHandler } from "react";
import Flag from "react-world-flags";
import MobileMenu from "../MobileMenu/MobileMenu";
import MobileLanguageSelector from "../LanguageSelector/MobileLanguageSelector";
import { languageFeatures } from "@/app/context/GlobalContext";

interface TopMenuProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: Boolean;
}

export default function TopMenu({ toggleSidebar, showSidebar }: TopMenuProps) {
  const {
    currentlyActiveLanguage,
    setCurrentlyActiveLanguage,
    toggleMobileMenu,
    user,
  } = useGlobalContext();

  const languages = user.languages.map((lang) => lang.code);

  return (
    <header className="absolute top-0 flex items-center justify-between w-full text-xl bg-opacity-25 select-none bg-slate-200">
      <div
        className={`flex gap-2 justify-center items-center h-20 w-20 md:w-48 p-2 transition-all hover:bg-slate-300 
        ${showSidebar && "invisible"}
        `}
        onClick={toggleSidebar}
      >
        <HamburgerMenu />
        <div className="hidden md:block">Linguardian</div>
      </div>
      <div className="hidden md:block">Courses | Dictionaries | Social</div>
      <Flag
        code={languageFeatures[currentlyActiveLanguage].flagCode}
        className={`md:hidden rounded-full object-cover w-16 h-16 m-0 border-2 border-slate-300`}
        onClick={toggleMobileMenu as MouseEventHandler}
      />
      <MobileMenu>
        <MobileLanguageSelector
          languages={languages}
          setCurrentlyActiveLanguage={setCurrentlyActiveLanguage!}
          toggleMobileMenu={toggleMobileMenu!}
        />
      </MobileMenu>
      <div className="flex items-center justify-between gap-2 mx-2">
        <LanguageSelector /> <UserMenu />
      </div>
    </header>
  );
}
