"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/helperFunctionsClient";
import { Button } from "@headlessui/react";
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
    <li className="w-full select-none list-none">
      <Link
        href={href}
        onClick={() => {
          if (onClick) onClick();
          setShowSidebar(false);
        }}
      >
        <Button
          className={`flex h-20 w-full items-center pl-4 text-blue-800 hover:bg-blue-100/60 phone:h-24 phone:w-[340px] phone:pl-8`}
        >
          {icon}
          {label && (
            <div className="w-full text-center font-serif text-hmd">
              {label}
            </div>
          )}
        </Button>
      </Link>
    </li>
  );
}
