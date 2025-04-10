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
          className="hidden h-20 items-center font-script text-llg text-blue-800 decoration-2 underline-offset-8 hover:underline desktop:flex"
        >
          Linguardian
          {/* 林果点 (lín guǒ diǎn), 灵果典 (líng guǒ diǎn)*/}
        </Link>
        <Link
          href={paths.dashboardLanguagePath(activeLanguage?.code)}
          className="relative inline-block font-script text-lmd font-semibold text-blue-800 phone:text-llg desktop:hidden"
        >
          <div className="inline">L</div>
          <div className="absolute bottom-2.5 left-4 border-b-2 border-transparent text-lsm hover:border-blue-800 phone:bottom-5 phone:left-5 tablet:bottom-3 tablet:left-6 tablet:text-lmd">
            inguardian
          </div>
        </Link>
      </div>
    );
}
