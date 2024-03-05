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
        <div className="absolute top-0 flex h-20 w-full select-none items-center justify-between bg-slate-300 bg-opacity-25 text-xl">
          <div className={"flex items-center md:w-52"}>
            <div
              className="flex h-20 w-20 items-center justify-center px-4 text-3xl transition-all hover:bg-slate-300"
              onClick={toggleSidebar}
            >
              <RxHamburgerMenu />
            </div>
            <div className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex">
              <Link href="/">Linguardian</Link>
            </div>
          </div>
          <div className="hidden md:flex">
            <Link
              href="/courses"
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Courses
            </Link>
            <Link
              href="/dictionary"
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Dictionary
            </Link>
            <Link
              href="/social"
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Social
            </Link>
          </div>
          <Flag
            code={languageFeatures[currentlyActiveLanguage].flagCode}
            className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
            onClick={toggleMobileMenu as MouseEventHandler}
          />
          <MobileMenu>
            <MobileLanguageSelector
              languages={languages}
              setCurrentlyActiveLanguage={setCurrentlyActiveLanguage!}
              toggleMobileMenu={toggleMobileMenu!}
            />
          </MobileMenu>
          <div className="flex h-20 w-20 items-center justify-evenly md:w-52 md:gap-x-2">
            <LanguageSelector /> <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
