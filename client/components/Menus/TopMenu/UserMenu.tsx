import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { signOut } from "next-auth/react";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";

import { User } from "@/types";
import useMobileMenuContext from "@/hooks/useMobileMenuContext";
import MobileMenu from "../MobileMenu/MobileMenu";
import SidebarItem from "./Sidebar/SideNavItem";
import paths from "@/paths";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import UserMenuItem from "./UserMenuItem";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const { toggleMobileMenu } = useMobileMenuContext();
  const [showUserMenu, setShowUserMenu] = useState<Boolean>(false);
  const router = useRouter();
  const ref = useOutsideClick(setShowUserMenu, showUserMenu);

  return (
    <>
      {/* Visible on desktop */}
      <div
        className="m-4 hidden h-[60px] w-[60px] select-none rounded-full bg-slate-200 transition-all hover:scale-125 md:block md:h-[50px] md:w-[50px]"
        onClick={() => {
          setShowUserMenu((x) => !x);
        }}
      >
        {user.image && (
          <Image
            src={user.image}
            alt="User profile image"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
      </div>
      {showUserMenu && (
        <div
          className="absolute -right-16 top-20 z-50 mr-2 mt-2 flex h-36 w-64 -translate-x-16 flex-col justify-center rounded-md border border-slate-500 bg-slate-100 p-6"
          ref={ref}
        >
          <div className="flex flex-col gap-y-3">
            <UserMenuItem
              to={paths.profilePath()}
              icon={<FaUserAlt />}
              label="Profile"
            />
            <UserMenuItem
              to={paths.settingsPath()}
              icon={<IoSettings />}
              label="Settings"
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
        {user.image && (
          <Image
            src={user.image}
            alt="User profile image"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
      </div>
      <MobileMenu fromDirection="animate-from-right">
        <nav className="flex select-none flex-col items-center transition-all">
          {user.image && (
            <Image
              src={user.image}
              alt="User profile image"
              width={200}
              height={200}
              className="mb-16 rounded-full"
            />
          )}
          <SidebarItem
            icon={<FaUserAlt />}
            label="Profile"
            href={paths.profilePath()}
          />
          <SidebarItem
            icon={<IoSettings />}
            label="Settings"
            href={paths.settingsPath()}
          />
          <div
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
          </div>
        </nav>
      </MobileMenu>
    </>
  );
}
