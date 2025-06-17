"use client";

import { FaBookReader, FaRegQuestionCircle } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import {
  RiDashboardFill,
  RiFileList3Fill,
  RiLogoutBoxLine,
} from "react-icons/ri";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/helperFunctionsClient";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import useUserOnClient from "@/lib/hooks/useUserOnClient";
import paths from "@/lib/paths";
import { signOut } from "next-auth/react";
import SideNavItem from "./SideNavItem";

interface SideBarNavigationProps {}

export default function SideBarNavigation({}: SideBarNavigationProps) {
  const { toggleSidebar, showSidebar } = useSidebar();
  const { activeLanguage } = useActiveLanguage();
  const ref = useOutsideClick(toggleSidebar, showSidebar);
  const user = useUserOnClient();

  return (
    <nav
      id="SidebarNavigation"
      className={cn(
        "absolute top-[112px] z-50 flex h-[calc(100vh-112px)] w-full phone:w-[340px] flex-col justify-between bg-white shadow-xl transition-all",
        !showSidebar && "-translate-x-[2660px]"
      )}
      ref={ref}
    >
      {activeLanguage && (
        <>
          <div>
            <SideNavItem
              icon={<RiDashboardFill className="h-[48px] w-[48px]" />}
              label="Dashboard"
              href={paths.dashboardLanguagePath(activeLanguage.code)}
            />
            <SideNavItem
              icon={<RiFileList3Fill className="h-[48px] w-[48px]" />}
              label="Lists"
              href={paths.listsLanguagePath(activeLanguage.code)}
            />
            <SideNavItem
              icon={<FaBookReader className="h-[48px] w-[48px]" />}
              label="Dictionary"
              href={paths.dictionaryPath()}
            />
            {/* <SideNavItem
                icon={<FaPeopleRoof className="h-[48px] w-[48px]" />}
                label="Community"
                href={paths.socialPath()}
              /> */}
            <SideNavItem
              icon={<ImProfile className="h-[48px] w-[48px]" />}
              label="Profile"
              href={paths.profilePath(user.usernameSlug)}
            />
          </div>
          <div className="grid items-end">
            <SideNavItem
              icon={
                <FaRegQuestionCircle className="h-[48px] w-[48px]" />
              }
              label="About"
              href={paths.aboutPath()}
            />
            <SideNavItem
              icon={<IoSettings className="h-[48px] w-[48px]" />}
              label="Settings"
              href={paths.settingsPath()}
            />
            <SideNavItem
              icon={<RiLogoutBoxLine className="h-[48px] w-[48px]" />}
              label="Logout"
              href={paths.aboutPath()}
              onClick={() => {
                signOut({ callbackUrl: paths.rootPath() });
              }}
            />
          </div>
        </>
      )}
    </nav>
  );
}
