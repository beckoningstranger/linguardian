"use client";
import Dashboard from "@/components/Dashboard";
import Logo from "@/components/Logo";
import MobileMenuCloseButton from "@/components/Menus/MobileMenu/MobileMenuCloseButton";
import SidebarItem from "@/components/Menus/Sidebar/SideBarItem";
import SideBarNavigation from "@/components/Menus/Sidebar/SideBarNavigation";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import { useState, useEffect } from "react";
import { RxAllSides, RxHamburgerMenu } from "react-icons/rx";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/home")
      .then((response) => response.json())
      .then((data) => console.log(data.message));
  }, []);

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
        <nav className="last:mb-0">
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
        <footer className="first:mt-0">
          <SidebarItem icon={<RxAllSides />} label="About" />
          <SidebarItem icon={<RxAllSides />} label="Logout" />
        </footer>
        <MobileMenuCloseButton close={toggleSidebar} />
      </SideBarNavigation>
      <Dashboard />
    </>
  );
}