"use client";

import Link from "next/link";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import paths from "@/lib/paths";

interface TopMenuLogoProps {}
export default function TopMenuLogo({}: TopMenuLogoProps) {
  const { activeLanguage } = useActiveLanguage();
  if (activeLanguage)
    return (
      <div className="relative">
        <Link
          href={paths.dashboardLanguagePath(activeLanguage?.code)}
          className="hidden h-20 items-center font-dancing text-5xl font-bold text-blue-800 decoration-2 underline-offset-8 transition-all hover:underline desktop:flex"
        >
          Linguardian
        </Link>
        <Link
          href={paths.dashboardLanguagePath(activeLanguage?.code)}
          className="relative inline-block w-28 border-b-2 border-transparent font-dancing text-4xl font-semibold text-blue-800 transition-all duration-200 hover:border-blue-800 phone:text-5xl desktop:hidden"
        >
          <div className="inline">L</div>
          <div className="absolute bottom-1.5 left-4 text-lg phone:bottom-1 phone:left-5 phone:text-2xl">
            inguardian
          </div>
        </Link>
      </div>
    );
}
