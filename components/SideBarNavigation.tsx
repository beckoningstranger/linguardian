"use client";
import { RxAllSides, RxHamburgerMenu, RxCrossCircled } from "react-icons/rx";
import { useContext } from "react";
import { GlobalContext } from "@/app/context/GlobalContext";
import SidebarItem from "./SideBarItem";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import Logo from "./Logo";

export default function SideBarNavigation() {
  const { showSidebar, toggleSidebar } = useContext(GlobalContext);
  const ref = useOutsideClick(toggleSidebar!, showSidebar);

  return (
    <div
      className={`flex text-xl backdrop-blur-md absolute top-0 md:top- h-full ${
        showSidebar ? "w-full md:w-48" : "-translate-x-[200px]"
      } transition-all flex-col justify-center md:justify-start md:items-start md:space-between`}
      ref={ref}
    >
      <Logo
        classes={`flex items-center justify-center w-full absolute top-0 text-2xl font-bold h-28 -translate-x-2/4 left-[50%] md:hidden transition-all`}
      />
      <nav>
        <SidebarItem
          icon={<RxHamburgerMenu />}
          label="Linguardian"
          action={toggleSidebar}
          classes="invisible md:visible"
        />
        <SidebarItem
          icon={<RxCrossCircled />}
          classes="md:hidden text-5xl text-slate-600"
          action={toggleSidebar}
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
