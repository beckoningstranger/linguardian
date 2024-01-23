"use client";
import { RxAllSides, RxHamburgerMenu, RxCrossCircled } from "react-icons/rx";
import { useContext } from "react";
import { GlobalContext } from "@/app/context/GlobalContext";
import SidebarItem from "./SideBarItem";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";

export default function SideBarNavigation() {
  const { showSidebar, toggleSidebar } = useContext(GlobalContext);
  const ref = useOutsideClick(toggleSidebar!, showSidebar);

  return (
    <div
      className={`flex text-xl bg-slate-400 absolute top-0 h-full ${
        showSidebar ? "w-full md:w-48" : "-translate-x-[200px]"
      } transition-all flex-col justify-center md:justify-start md:items-start md:space-between`}
      ref={ref}
    >
      <nav>
        <button
          className="absolute top-3 right-2 md:hidden"
          onClick={toggleSidebar}
        >
          <RxCrossCircled className="text-4xl" />
        </button>
        <SidebarItem
          icon={<RxHamburgerMenu />}
          label="Linguardian"
          action={toggleSidebar}
          classes="invisible md:visible"
        />

        <SidebarItem icon={<RxAllSides />} label="Your Profile" />
        <SidebarItem icon={<RxAllSides />} label="Courses" />
        <SidebarItem icon={<RxAllSides />} label="Dictionary" />
        <SidebarItem icon={<RxAllSides />} label="Social" />
      </nav>
      <footer>
        <SidebarItem icon={<RxAllSides />} label="About" />
        <SidebarItem icon={<RxAllSides />} label="Logout" />
      </footer>
    </div>
  );
}
