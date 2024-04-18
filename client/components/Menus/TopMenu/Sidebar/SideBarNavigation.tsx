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
import paths from "@/paths";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
            href={paths.dashboardLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />

          <SidebarItem
            icon={<RiFileList3Fill />}
            label="Lists"
            href={paths.listsLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SidebarItem
            icon={<FaBookReader />}
            label="Dictionary"
            href={paths.dictionaryLanguagePath(currentlyActiveLanguage)}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <SidebarItem
            icon={<FaPeopleRoof />}
            label="Social"
            href={paths.socialPath()}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
        </nav>
        <footer className="first:mt-0">
          <SidebarItem
            icon={<FaRegQuestionCircle />}
            label="About"
            href={paths.aboutPath()}
            toggleSidebar={toggleSidebar as MouseEventHandler}
          />
          <div
            className={`my-4 flex select-none justify-center transition-all md:my-0 md:h-14 md:justify-start md:border-none md:p-10 md:hover:scale-100 md:hover:bg-slate-300`}
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <div className="flex w-48 items-center">
              <div className="flex items-center px-3 text-3xl md:pl-3">
                <RiLogoutBoxLine />
              </div>
              <div className="px-3 text-2xl md:text-xl">Logout</div>
            </div>
          </div>
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
