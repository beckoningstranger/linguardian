"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@/context/UserContext";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

interface TopMiddleNavigationProps {}

export default function TopMiddleNavigation({}: TopMiddleNavigationProps) {
  const currentPath = usePathname();
  const { activeLanguage } = useUser();

  const linkStyling =
    "tablet:flex h-20 items-center font-serif text-3xl decoration-2 font-semibold underline-offset-8 hover:underline text-blue-800";

  if (!activeLanguage) return null;

  return (
    <div
      className="absolute left-1/2 hidden -translate-x-1/2 gap-6 tablet:flex"
      id="TopMiddleNavigation"
    >
      <Link
        href={paths.listStorePath(activeLanguage?.code)}
        className={cn(
          linkStyling,
          currentPath.includes("lists") &&
            !currentPath.includes("lists/") &&
            "underline"
        )}
      >
        Lists
      </Link>
      <Link
        href={paths.dictionaryPath()}
        className={cn(
          linkStyling,
          currentPath.includes("dictionary") &&
            !currentPath.includes("dictionary/") &&
            "underline"
        )}
      >
        Dictionary
      </Link>
      {/* <Link href={paths.socialPath()} className={linkStyling}>
            Community
          </Link> */}
    </div>
  );
}
