"use client";

import { useSidebar } from "@/context/SidebarContext";
import { MouseEventHandler } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

interface HamburgerMenuProps {}

export default function HamburgerMenu({}: HamburgerMenuProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="flex h-20 w-20 items-center justify-center px-4 text-3xl transition-all hover:bg-slate-300"
      onClick={toggleSidebar}
    >
      <RxHamburgerMenu />
    </div>
  );
}
