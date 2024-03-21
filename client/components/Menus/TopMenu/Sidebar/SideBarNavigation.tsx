"use client";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MouseEventHandler } from "react";
import Logo from "@/components/Logo";
import SidebarItem from "./SideBarItem";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegQuestionCircle, FaBookReader } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiLogoutBoxLine, RiFileList3Fill } from "react-icons/ri";
import CloseButton from "@/components/Menus/MobileMenu/MobileMenuCloseButton";
import { SupportedLanguage } from "@/types";

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
          <SidebarItem
            icon={<RxHamburgerMenu />}
            label="Dashboard"
            href={`/dashboard?lang=${currentlyActiveLanguage}`}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />

          <SidebarItem
            icon={<RiFileList3Fill />}
            label="Lists"
            href={`/lists?lang=${currentlyActiveLanguage}`}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SidebarItem
            icon={<FaBookReader />}
            label="Dictionary"
            href={`/dictionary?lang=${currentlyActiveLanguage}`}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SidebarItem
            icon={<FaPeopleRoof />}
            label="Social"
            href="/social"
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
        </nav>
        <footer className="first:mt-0">
          <SidebarItem
            icon={<FaRegQuestionCircle />}
            label="About"
            href="/about"
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SidebarItem
            icon={<RiLogoutBoxLine />}
            label="Logout"
            href="/logout"
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
