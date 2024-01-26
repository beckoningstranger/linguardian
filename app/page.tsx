"use client";
import Dashboard from "@/components/Dashboard";
import Logo from "@/components/Logo";
import SidebarItem from "@/components/SideBarItem";
import SideBarNavigation from "@/components/SideBarNavigation";
import TopMenu from "@/components/TopMenu";
import { useState } from "react";
import { RxAllSides, RxCrossCircled, RxHamburgerMenu } from "react-icons/rx";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <TopMenu showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      <SideBarNavigation
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
      >
        <Logo />
        <nav>
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
        <SidebarItem
          icon={<RxCrossCircled className="mx-auto" />}
          classes="md:hidden text-5xl text-slate-600"
          action={toggleSidebar}
        />
      </SideBarNavigation>
      <Dashboard />
    </>
  );
}
