"use client";

import { useSidebar } from "@/context/SidebarContext";
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
      className={`flex select-none list-none justify-center ${
        showSidebar && "w-screen phone:w-[340px]"
      }`}
    >
      <Link
        href={href}
        onClick={() => {
          if (onClick) onClick();
          setShowSidebar(false);
        }}
      >
        <div
          className={`flex h-16 w-[340px] items-center pl-1 text-blue-800 hover:bg-blue-100/60 phone:h-24 tablet:pl-7`}
        >
          <div>{icon}</div>
          {label && (
            <div className="flex w-full justify-center font-serif text-2xl font-semibold">
              {label}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
