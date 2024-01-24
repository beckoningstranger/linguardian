"use client";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";
import HamburgerMenu from "./HamburgerMenu";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import { MouseEventHandler, useEffect, useState } from "react";
import Flag from "react-world-flags";
import MobileMenu from "./MobileMenu";

interface TopMenuProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: Boolean;
}

export default function TopMenu({ toggleSidebar, showSidebar }: TopMenuProps) {
  const {
    currentlyActiveLanguage,
    setCurrentlyActiveLanguage,
    toggleMobileLanguageSelectorOn,
    showMobileMenu,
    userLanguages: languages,
    toggleMobileMenuOff,
  } = useGlobalContext();

  return (
    <header className="absolute top-0 flex items-center justify-between w-full text-xl bg-opacity-25 select-none bg-slate-200">
      <div
        className={`flex gap-2 justify-center items-center h-20 w-20 md:w-48 mx-2 
        ${showSidebar && "invisible"}
        `}
        onClick={toggleSidebar}
      >
        <HamburgerMenu />
        <div className="hidden md:block">Linguardian</div>
      </div>
      <div className="hidden md:block">Courses | Dictionaries | Social</div>
      <Flag
        code={currentlyActiveLanguage!}
        className={`md:hidden rounded-full object-cover w-[80px] h-[80px] md:w-[50px] md:h-[50px] m-0 border-2 border-slate-300`}
        onClick={toggleMobileLanguageSelectorOn}
      />
      <MobileMenu>
        {showMobileMenu && (
          <div className="flex flex-col items-center gap-10">
            {languages!.map((language) => {
              return (
                <Flag
                  key={language}
                  code={language}
                  onClick={() => {
                    setCurrentlyActiveLanguage!(language);
                    toggleMobileMenuOff!();
                  }}
                  className={`transition-all rounded-full object-cover w-24 h-24 border-2  border-slate-300`}
                />
              );
            })}
          </div>
        )}
      </MobileMenu>
      <div className="flex items-center justify-between gap-2 mx-2">
        <LanguageSelector /> <UserMenu />
      </div>
    </header>
  );
}
