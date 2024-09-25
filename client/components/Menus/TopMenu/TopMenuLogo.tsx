"use client";

import Link from "next/link";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import paths from "@/lib/paths";

interface TopMenuLogoProps {}
export default function TopMenuLogo({}: TopMenuLogoProps) {
  const { activeLanguage } = useActiveLanguage();
  return (
    <Link
      href={paths.dashboardLanguagePath(activeLanguage)}
      className="hidden h-20 items-center px-3 transition-all hover:bg-slate-300 md:flex"
    >
      Linguardian
    </Link>
  );
}
