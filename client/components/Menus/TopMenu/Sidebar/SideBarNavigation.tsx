"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { MouseEventHandler } from "react";
import { FaBookReader, FaRegQuestionCircle } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiFileList3Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoWithCloseButton from "../../LogoWithCloseButton";
import SideNavItem from "./SideNavItem";

interface SideBarNavigationProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: boolean;
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
        className={`flex flex-col md:justify-between md:items-start md:space-between h-full backdrop-blur-md absolute top-0 transition-all md:bg-slate-100 z-10 ${
          showSidebar ? "w-full md:w-auto z-50" : "-translate-x-[300px]"
        }
        `}
        ref={ref}
      >
        <LogoWithCloseButton toggleFunction={toggleSidebar} />
        <nav className="grid h-full place-items-center last:mb-0 md:place-items-start">
          <div className="grid">
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
              href={paths.dictionaryPath()}
              toggleSidebar={toggleSidebar as MouseEventHandler}
            />
            <SideNavItem
              icon={<FaPeopleRoof />}
              label="Social"
              href={paths.socialPath()}
              toggleSidebar={toggleSidebar as MouseEventHandler}
            />
            <SideNavItem
              icon={<FaRegQuestionCircle />}
              label="About"
              href={paths.aboutPath()}
              toggleSidebar={toggleSidebar as MouseEventHandler}
            />
          </div>
        </nav>
      </div>
    </>
  );
}
