"use client";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import UserMenu from "../UserMenu";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import { MouseEventHandler, useState } from "react";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";
import MobileMenu from "../MobileMenu/MobileMenu";
import MobileLanguageSelector from "../LanguageSelector/MobileLanguageSelector";
import { languageFeatures } from "@/app/context/GlobalContext";
import SideBarNavigation from "../Sidebar/SideBarNavigation";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

export default function TopMenu() {
  // These two variables are used so that the LanguageSelector show only on the specified URLs
  const currentBaseUrl = usePathname();
  const LanguageSelectorOn = ["/dashboard", "/dictionary", "/lists"];

  const { currentlyActiveLanguage, toggleMobileMenu, user } =
    useGlobalContext();

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
          currentlyActiveLanguage={currentlyActiveLanguage}
        />
        <div className="absolute top-0 flex h-20 w-full select-none items-center justify-between bg-slate-300 bg-opacity-25 text-xl">
          <div className={"flex items-center"}>
            <div
              className="flex h-20 w-20 items-center justify-center px-4 text-3xl transition-all hover:bg-slate-300"
              onClick={toggleSidebar}
            >
              <RxHamburgerMenu />
            </div>

            <Link
              href={`/dashboard?lang=${currentlyActiveLanguage}`}
              className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex"
            >
              Linguardian
            </Link>
          </div>
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
            <Link
              href={`/lists?lang=${currentlyActiveLanguage}`}
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Lists
            </Link>
            <Link
              href={`/dictionary?lang=${currentlyActiveLanguage}`}
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

          {/* The language selector will only be shown depending on the url, see above */}
          <div
            className={`${
              !LanguageSelectorOn.includes(currentBaseUrl) && "hidden"
            }`}
          >
            <Flag
              code={languageFeatures[currentlyActiveLanguage].flagCode}
              className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
              onClick={toggleMobileMenu as MouseEventHandler}
            />
            <MobileMenu>
              <MobileLanguageSelector />
            </MobileMenu>
          </div>
          <div className="flex h-20 items-center justify-evenly">
            <div
              className={`${
                !LanguageSelectorOn.includes(currentBaseUrl) && "hidden"
              } z-50`}
            >
              <LanguageSelector />
            </div>

            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
