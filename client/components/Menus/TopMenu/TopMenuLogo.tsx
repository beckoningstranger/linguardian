"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@/context/UserContext";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

interface TopMenuLogoProps {}
export default function TopMenuLogo({}: TopMenuLogoProps) {
  const { activeLanguage } = useUser();

  const currentPath = usePathname();

  if (!activeLanguage) return null;

  return (
    <div className="relative">
      <Link
        href={paths.dashboardLanguagePath(activeLanguage?.code)}
        className={`hidden h-20 items-center font-script text-llg text-blue-800 decoration-2 hover:underline underline-offset-8 desktop:flex ${
          currentPath.includes("dashboard") && " underline"
        }`}
      >
        Linguardian
        {/* 林果点 (lín guǒ diǎn), 灵果典 (líng guǒ diǎn)*/}
      </Link>
      <Link
        href={paths.dashboardLanguagePath(activeLanguage?.code)}
        className={`relative inline-block font-script text-lmd font-semibold text-blue-800 phone:text-llg desktop:hidden`}
      >
        <div className="inline">L</div>
        <div
          className={cn(
            "absolute bottom-2.5 left-4 text-lsm phone:bottom-[16px] phone:left-5 tablet:bottom-2 tablet:left-5 tablet:text-lmd hover:before:absolute tablet:hover:before:-bottom-0 desktop:hover:before:-bottom-2.5 hover:before:-bottom-2.5 hover:before:left-[-20px] hover:before:h-[2px] hover:before:w-[calc(100%+20px)] hover:before:bg-current",
            currentPath.includes("dashboard") &&
              "before:absolute desktop:before:-bottom-2.5 tablet:before:-bottom-0 hover:before:-bottom-2 before:-bottom-2 before:left-[-20px] before:h-[2px] before:w-[calc(100%+20px)] before:bg-current"
          )}
        >
          inguardian
        </div>
      </Link>
    </div>
  );
}
