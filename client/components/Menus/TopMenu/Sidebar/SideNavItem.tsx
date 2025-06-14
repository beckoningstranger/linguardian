"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/helperFunctionsClient";
import Link from "next/link";
import { ReactElement } from "react";

interface SideNavItemProps {
  icon: ReactElement;
  label: string;
  href: string;
  onClick?: Function;
}

export default function SideNavItem({
  icon,
  label,
  href,
  onClick,
}: SideNavItemProps) {
  const { setShowSidebar, showSidebar } = useSidebar();
  return (
    <li
      className={cn(
        "flex select-none list-none",
        showSidebar && "w-screen phone:w-[340px]"
      )}
    >
      <Link
        href={href}
        onClick={() => {
          if (onClick) onClick();
          setShowSidebar(false);
        }}
      >
        <div
          className={`flex h-16 w-[340px] items-center pl-4 text-blue-800 hover:bg-blue-100/60 phone:h-24 phone:pl-8`}
        >
          <div>{icon}</div>
          {label && (
            <div className="absolute left-1/2 -translate-x-1/2 font-serif text-hmd phone:static phone:flex phone:w-full phone:translate-x-0 phone:justify-center">
              {label}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
