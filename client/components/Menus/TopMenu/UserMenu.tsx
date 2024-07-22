import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";

import { SessionUser } from "@/lib/types";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import MobileMenu from "../MobileMenu/MobileMenu";
import SidebarItem from "./Sidebar/SideNavItem";
import paths from "@/lib/paths";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import UserMenuItem from "./UserMenuItem";

interface UserMenuProps {}

export default function UserMenu({}: UserMenuProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const [showUserMenu, setShowUserMenu] = useState<Boolean>(false);
  const sessionUser = useSession().data?.user as SessionUser;

  return (
    <>
      {/* Visible on desktop */}
      <div
        className="m-4 hidden h-[60px] w-[60px] select-none rounded-full bg-slate-200 transition-all hover:scale-125 md:block md:h-[50px] md:w-[50px]"
        onClick={() => {
          setShowUserMenu((x) => !x);
        }}
      >
        {sessionUser?.image && (
          <Image
            src={sessionUser.image}
            alt="User profile image"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
      </div>
      {showUserMenu && (
        <div className="absolute -right-16 top-20 z-50 mr-2 mt-2 flex h-36 w-64 -translate-x-16 flex-col justify-center rounded-md border border-slate-500 bg-slate-100 p-6">
          <div className="flex flex-col gap-y-3">
            <UserMenuItem
              to={paths.profilePath(sessionUser.usernameSlug)}
              icon={<FaUserAlt />}
              label="Profile"
              onClick={() => setShowUserMenu(false)}
            />
            <UserMenuItem
              to={paths.settingsPath()}
              icon={<IoSettings />}
              label="Settings"
              onClick={() => setShowUserMenu(false)}
            />
            <UserMenuItem
              icon={<RiLogoutBoxLine />}
              label="Logout"
              onClick={() => {
                signOut({ callbackUrl: paths.rootPath() });
              }}
            />
          </div>
        </div>
      )}
      {/* Visible on mobile */}
      <div
        className="m-4 h-[60px] w-[60px] select-none rounded-full bg-slate-200 md:hidden md:h-[50px] md:w-[50px]"
        onClick={toggleMobileMenu as MouseEventHandler}
      >
        {sessionUser?.image && (
          <Image
            src={sessionUser.image}
            alt="User profile image"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
      </div>
      <MobileMenu fromDirection="animate-from-right">
        <nav className="flex select-none flex-col items-center transition-all">
          <ul>
            {sessionUser?.image && (
              <Image
                src={sessionUser.image}
                alt="User profile image"
                width={200}
                height={200}
                className="mb-16 rounded-full"
              />
            )}
            <SidebarItem
              icon={<FaUserAlt />}
              label="Profile"
              href={paths.profilePath(sessionUser?.usernameSlug)}
              toggleSidebar={toggleMobileMenu as MouseEventHandler}
            />
            <SidebarItem
              icon={<IoSettings />}
              label="Settings"
              href={paths.settingsPath()}
              toggleSidebar={toggleMobileMenu as MouseEventHandler}
            />
            <li
              className={`my-4 flex select-none justify-center transition-all md:my-0 md:h-14 md:justify-start md:border-none md:p-10 md:hover:scale-100 md:hover:bg-slate-300`}
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              <div className="flex w-48 items-center hover:cursor-pointer">
                <div className="px-3 text-3xl">
                  <RiLogoutBoxLine />
                </div>
                <div className="px-3 text-2xl md:text-xl">Logout</div>
              </div>
            </li>
          </ul>
        </nav>
      </MobileMenu>
    </>
  );
}
