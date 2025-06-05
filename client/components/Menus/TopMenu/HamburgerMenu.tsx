"use client";

import { useSidebar } from "@/context/SidebarContext";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {}

export default function HamburgerMenu({}: HamburgerMenuProps) {
  const { toggleSidebar, showSidebar } = useSidebar();

  const styling =
    "h-[48px] w-[48px] rounded-lg pl-1 text-blue-800 hover:bg-blue-100/60 tablet:h-[72px] tablet:w-[72px] tablet:px-3";

  return !showSidebar ? (
    <RxHamburgerMenu className={styling} onClick={toggleSidebar} />
  ) : (
    <RxCross2 className={styling} />
  );
}
