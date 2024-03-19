"use client";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import UserMenu from "./UserMenu";
import { MouseEventHandler, useState } from "react";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";
import MobileMenu from "../MobileMenu/MobileMenu";
import MobileLanguageSelector from "./LanguageSelector/MobileLanguageSelector";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { SupportedLanguage, User } from "@/types";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import { MobileMenuContextProvider } from "../MobileMenu/MobileMenuContext";

interface TopMenuProps {
  user: User;
  currentlyActiveLanguage: SupportedLanguage;
}

export default function TopMenu({
  user,
  currentlyActiveLanguage,
}: TopMenuProps) {
  // These two variables are used so that the LanguageSelector show only on the specified URLs
  const currentBaseUrl = usePathname();
  const LanguageSelectorOn = [
    "/app/dashboard",
    "/app/dictionary",
    "/app/lists",
  ];

  const { toggleMobileMenu } = useMobileMenuContext();

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
            <div
              className="flex h-20 w-20 items-center justify-center px-4 text-3xl transition-all hover:bg-slate-300"
              onClick={toggleSidebar}
            >
              <RxHamburgerMenu />
            </div>

            <Link
              href={`/app/dashboard?lang=${currentlyActiveLanguage}`}
              className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex"
            >
              Linguardian
            </Link>
          </div>
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
            <Link
              href={`/app/lists?lang=${currentlyActiveLanguage}`}
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Lists
            </Link>
            <Link
              href={`/app/dictionary?lang=${currentlyActiveLanguage}`}
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Dictionary
            </Link>
            <Link
              href="/app/social"
              className="flex h-20 items-center px-4 hover:bg-slate-300"
            >
              Social
            </Link>
          </div>

          {/* The language selector will only be shown depending on the url, see above */}
          <div
            className={
              !LanguageSelectorOn.includes(currentBaseUrl)
                ? "hidden"
                : undefined
            }
          >
            <Flag
              // There is a bug here because there is no EN flag, just GB and US, we need to get the flagcode from languageFeatures is global settings
              // This is a temporary workaround as there will be more languages for which we need a different flag code
              code={
                currentlyActiveLanguage === "EN"
                  ? "GB"
                  : currentlyActiveLanguage
              }
              className={`m-0 h-16 w-16 rounded-full border-2 border-slate-300 object-cover md:hidden`}
              onClick={toggleMobileMenu as MouseEventHandler}
            />
            <MobileMenu>
              <MobileLanguageSelector user={user} />
            </MobileMenu>
          </div>
          <div className="flex h-20 items-center justify-evenly">
            <div
              className={`${
                !LanguageSelectorOn.includes(currentBaseUrl) && "hidden"
              } z-50`}
            >
              <LanguageSelector
                currentlyActiveLanguage={currentlyActiveLanguage}
                user={user}
              />
            </div>

            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
