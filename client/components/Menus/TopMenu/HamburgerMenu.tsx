"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

interface HamburgerMenuProps {}

export default function HamburgerMenu({}: HamburgerMenuProps) {
  const { toggleSidebar, showSidebar } = useSidebar();

  return (
    <div
      className={cn(
        "hover:bg-blue-100/80 hover:rounded-lg relative ml-2 flex size-8 items-center justify-center transition-all duration-300 phone:size-10 tablet:size-12",
        showSidebar ? "sidebar-open" : "sidebar-closed"
      )}
      onClick={toggleSidebar}
    >
      <div
        className={cn(
          "absolute transition-all duration-300 h-[4px] w-[calc(100%-4px)] rounded-lg bg-blue-800",
          showSidebar ? "rotate-45" : "tablet:-translate-y-4 -translate-y-3"
        )}
      />
      <div
        className={cn(
          "absolute transition-all duration-300 h-[4px] w-[calc(100%-4px)] rounded-lg bg-blue-800",
          showSidebar ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "absolute transition-all duration-300 h-[4px]  w-[calc(100%-4px)] rounded-lg bg-blue-800",
          showSidebar ? "-rotate-45" : "tablet:translate-y-4 translate-y-3"
        )}
      />
    </div>
  );
}
