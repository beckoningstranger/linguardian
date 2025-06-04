"use client";

import Link from "next/link";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import paths from "@/lib/paths";

interface TopMiddleNavigationProps {}

export default function TopMiddleNavigation({}: TopMiddleNavigationProps) {
  const { activeLanguage } = useActiveLanguage();
  const linkStyling =
    "tablet:flex h-20 items-center font-serif text-3xl decoration-2 font-semibold underline-offset-8 hover:underline text-blue-800";

  if (activeLanguage)
    return (
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 gap-6 tablet:flex"
        id="TopMiddleNavigation"
      >
        <Link
          href={paths.listsLanguagePath(activeLanguage?.code)}
          className={linkStyling}
        >
          Lists
        </Link>
        <Link href={paths.dictionaryPath()} className={linkStyling}>
          Dictionary
        </Link>
        {/* <Link href={paths.socialPath()} className={linkStyling}>
            Community
          </Link> */}
      </div>
    );
}
