"use client";

import { useSidebar } from "@/context/SidebarContext";
import { RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {}

export default function HamburgerMenu({}: HamburgerMenuProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <RxHamburgerMenu
      className="h-[48px] w-[48px] rounded-lg text-blue-800 hover:bg-grey-100 tablet:h-[72px] tablet:w-[72px] tablet:px-3"
      onClick={toggleSidebar}
    />
  );
}
