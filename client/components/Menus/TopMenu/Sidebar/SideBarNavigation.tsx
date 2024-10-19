"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useSidebar } from "@/context/SidebarContext";
import { useOutsideClick } from "@/lib/hooks";
import paths from "@/lib/paths";
import { RefObject } from "react";
import { FaBookReader, FaRegQuestionCircle } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiFileList3Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoWithCloseButton from "../../LogoWithCloseButton";
import SideNavItem from "./SideNavItem";

interface SideBarNavigationProps {}

export default function SideBarNavigation({}: SideBarNavigationProps) {
  const { toggleSidebar, showSidebar } = useSidebar();
  const { activeLanguage } = useActiveLanguage();
  const ref = useOutsideClick(toggleSidebar, showSidebar);

  return (
    <>
      <div
        className={`flex flex-col md:justify-between md:items-start md:space-between h-full backdrop-blur-md absolute top-0 transition-all md:bg-slate-100 z-10 ${
          showSidebar ? "w-full md:w-auto z-50" : "-translate-x-[400px]"
        }
        `}
        ref={ref as RefObject<HTMLDivElement>}
      >
        <LogoWithCloseButton toggleFunction={toggleSidebar} />
        <nav className="grid h-full place-items-center last:mb-0 md:place-items-start">
          <div className="grid">
            {activeLanguage && (
              <>
                <SideNavItem
                  icon={<RxHamburgerMenu />}
                  label="Dashboard"
                  href={paths.dashboardLanguagePath(activeLanguage.code)}
                />
                <SideNavItem
                  icon={<RiFileList3Fill />}
                  label="Lists"
                  href={paths.listsLanguagePath(activeLanguage.code)}
                />
              </>
            )}
            <SideNavItem
              icon={<FaBookReader />}
              label="Dictionary"
              href={paths.dictionaryPath()}
            />
            <SideNavItem
              icon={<FaPeopleRoof />}
              label="Social"
              href={paths.socialPath()}
            />
            <SideNavItem
              icon={<FaRegQuestionCircle />}
              label="About"
              href={paths.aboutPath()}
            />
          </div>
        </nav>
      </div>
    </>
  );
}
