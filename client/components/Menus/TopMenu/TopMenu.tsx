"use client";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import UserMenu from "../UserMenu";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import { MouseEventHandler, useState } from "react";
import Flag from "react-world-flags";
import MobileMenu from "../MobileMenu/MobileMenu";
import MobileLanguageSelector from "../LanguageSelector/MobileLanguageSelector";
import { languageFeatures } from "@/app/context/GlobalContext";
import SideBarNavigation from "../Sidebar/SideBarNavigation";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

export default function TopMenu() {
  const {
    currentlyActiveLanguage,
    setCurrentlyActiveLanguage,
    toggleMobileMenu,
    user,
  } = useGlobalContext();

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const languages = user.languages.map((lang) => lang.code);

  return (
    <>
      <header>
        <SideBarNavigation
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
        />
        <div className="absolute top-0 flex items-center justify-between w-full h-20 text-xl bg-opacity-25 select-none bg-slate-300">
          <div className={"flex items-center md:w-52"}>
            <div
              className="text-3xl h-20 flex items-center px-4 w-20 justify-center transition-all hover:bg-slate-300"
              onClick={toggleSidebar}
            >
              <RxHamburgerMenu />
            </div>
            <div className="hidden md:flex items-center px-3 h-20 transition-all hover:bg-slate-300">
              <Link href="/">Linguardian</Link>
            </div>
          </div>
          <div className="hidden md:flex">
            <Link
              href="/courses"
              className="h-20 hover:bg-slate-300 flex items-center px-4"
            >
              Courses
            </Link>
            <Link
              href="/dictionary"
              className="h-20 hover:bg-slate-300 flex items-center px-4"
            >
              Dictionary
            </Link>
            <Link
              href="/social"
              className="h-20 hover:bg-slate-300 flex items-center px-4"
            >
              Social
            </Link>
          </div>
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
          <div className="flex items-center justify-evenly md:gap-x-2 md:w-52 h-20 w-20">
            <LanguageSelector /> <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
