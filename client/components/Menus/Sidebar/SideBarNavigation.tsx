import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import { MouseEventHandler } from "react";
import Logo from "@/components/Logo";
import SidebarItem from "./SideBarItem";
import { RxAllSides, RxHamburgerMenu } from "react-icons/rx";
import MobileMenuCloseButton from "../MobileMenu/MobileMenuCloseButton";

interface SideBarNavigationProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: Boolean;
}

export default function SideBarNavigation({
  toggleSidebar,
  showSidebar,
}: SideBarNavigationProps) {
  const ref = useOutsideClick(toggleSidebar, showSidebar);
  return (
    <>
      <div
        className={`flex flex-col justify-center md:justify-start md:items-start md:space-between h-screen text-xl backdrop-blur-md absolute top-0 transition-all md:bg-slate-100 border-r-2 z-10 ${
          showSidebar ? "w-full md:w-auto" : "-translate-x-[300px]"
        }
        `}
        ref={ref}
      >
        <Logo />
        <nav className="last:mb-0">
          <div className="invisible md:visible">
            <SidebarItem
              icon={<RxHamburgerMenu />}
              label="Linguardian"
              action={toggleSidebar}
            />
          </div>
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
      </div>
    </>
  );
}
