"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useSidebar } from "@/context/SidebarContext";
import { useOutsideClick } from "@/lib/hooks";
import paths from "@/lib/paths";
import { User } from "@/lib/types";
import { signOut, useSession } from "next-auth/react";
import { RefObject } from "react";
import { FaBookReader, FaRegQuestionCircle } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import {
  RiDashboardFill,
  RiFileList3Fill,
  RiLogoutBoxLine,
} from "react-icons/ri";
import SideNavItem from "./SideNavItem";

interface SideBarNavigationProps {}

export default function SideBarNavigation({}: SideBarNavigationProps) {
  const { toggleSidebar, showSidebar } = useSidebar();
  const { activeLanguage } = useActiveLanguage();
  const ref = useOutsideClick(toggleSidebar, showSidebar);
  const user = useSession().data?.user as User;

  return (
    <div
      className={`absolute top-[112px] transition-all shadow-xl z-50 ${
        !showSidebar && "-translate-x-[2660px]"
      }
        `}
      ref={ref as RefObject<HTMLDivElement>}
    >
      <nav className="flex h-[calc(100vh-112px)] flex-col justify-between bg-white/90">
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
                icon={<FaRegQuestionCircle className="h-[48px] w-[48px]" />}
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
    </div>
  );
}
