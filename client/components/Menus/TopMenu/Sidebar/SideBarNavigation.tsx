"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MouseEventHandler } from "react";
import Logo from "@/components/Logo";
import SideNavItem from "./SideNavItem";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegQuestionCircle, FaBookReader } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiFileList3Fill } from "react-icons/ri";
import CloseButton from "@/components/Menus/MobileMenu/MobileMenuCloseButton";
import { SupportedLanguage } from "@/types";
import paths from "@/paths";

interface SideBarNavigationProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: Boolean;
  currentlyActiveLanguage: SupportedLanguage;
}

export default function SideBarNavigation({
  toggleSidebar,
  showSidebar,
  currentlyActiveLanguage,
}: SideBarNavigationProps) {
  const ref = useOutsideClick(toggleSidebar, showSidebar);

  return (
    <>
      <div
        className={`flex flex-col justify-center md:justify-between md:items-start md:space-between h-full backdrop-blur-md absolute top-0 transition-all md:bg-slate-100 border-r-2 z-10 ${
          showSidebar ? "w-full md:w-auto" : "-translate-x-[300px]"
        }
        `}
        ref={ref}
      >
        <Logo />
        <nav className="last:mb-0">
          <SideNavItem
            icon={<RxHamburgerMenu />}
            label="Dashboard"
            href={paths.dashboardLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />

          <SideNavItem
            icon={<RiFileList3Fill />}
            label="Lists"
            href={paths.listsLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SideNavItem
            icon={<FaBookReader />}
            label="Dictionary"
            href={paths.dictionaryLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SideNavItem
            icon={<FaPeopleRoof />}
            label="Social"
            href={paths.socialPath()}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
        </nav>
        <footer className="first:mt-0">
          <SideNavItem
            icon={<FaRegQuestionCircle />}
            label="About"
            href={paths.aboutPath()}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
        </footer>
        <div
          onClick={toggleSidebar}
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
        >
          <CloseButton />
        </div>
      </div>
    </>
  );
}
