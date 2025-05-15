"use client";

import { useSidebar } from "@/context/SidebarContext";
import { RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {}

export default function HamburgerMenu({}: HamburgerMenuProps) {
  const { toggleSidebar, showSidebar } = useSidebar();

  return !showSidebar ? (
    <RxHamburgerMenu
      className="h-[48px] w-[48px] rounded-lg text-blue-800 hover:bg-blue-100/60 tablet:h-[72px] tablet:w-[72px] tablet:px-3"
      onClick={toggleSidebar}
    />
  ) : (
    <div>
      <RxHamburgerMenu className="h-[48px] w-[48px] rounded-lg text-blue-800 hover:bg-blue-100/60 tablet:h-[72px] tablet:w-[72px] tablet:px-3" />
    </div>
  );
}
