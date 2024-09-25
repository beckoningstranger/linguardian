"use client";

import Link from "next/link";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import paths from "@/lib/paths";

interface TopMiddleNavigationProps {}

export default function TopMiddleNavigation({}: TopMiddleNavigationProps) {
  const { activeLanguage } = useActiveLanguage();
  return (
    <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
      <Link
        href={paths.listsLanguagePath(activeLanguage)}
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Lists
      </Link>
      <Link
        href={paths.dictionaryPath()}
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Dictionary
      </Link>
      <Link
        href={paths.socialPath()}
        className="flex h-20 items-center px-4 hover:bg-slate-300"
      >
        Social
      </Link>
    </div>
  );
}
