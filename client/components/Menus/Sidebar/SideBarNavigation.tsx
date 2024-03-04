import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import { MouseEventHandler } from "react";
import Logo from "@/components/Logo";
import SidebarItem from "./SideBarItem";
import { RxAllSides, RxHamburgerMenu } from "react-icons/rx";
import { FaRegQuestionCircle, FaBookReader } from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { RiLogoutBoxLine, RiFileList3Fill } from "react-icons/ri";
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
        className={`flex flex-col justify-center md:justify-between md:items-start md:space-between h-full backdrop-blur-md absolute top-0 transition-all md:bg-slate-100 border-r-2 z-10 ${
          showSidebar ? "w-full md:w-auto" : "-translate-x-[300px]"
        }
        `}
        ref={ref}
      >
        <Logo />
        <nav className="last:mb-0">
          <div className="invisible md:visible" onClick={toggleSidebar}>
            <SidebarItem
              icon={<RxHamburgerMenu />}
              label="Linguardian"
              href="/"
            />
          </div>
          <SidebarItem
            icon={<RiFileList3Fill />}
            label="Courses"
            href="/courses"
          />
          <SidebarItem
            icon={<FaBookReader />}
            label="Dictionary"
            href="/dictionary"
          />
          <SidebarItem icon={<FaPeopleRoof />} label="Social" href="/social" />
        </nav>
        <footer className="first:mt-0">
          <SidebarItem
            icon={<FaRegQuestionCircle />}
            label="About"
            href="/about"
          />
          <SidebarItem
            icon={<RiLogoutBoxLine />}
            label="Logout"
            href="/logout"
          />
        </footer>
        <MobileMenuCloseButton close={toggleSidebar} />
      </div>
    </>
  );
}
