"use client";

import Link from "next/link";
import Flag from "react-world-flags";

import { useUser } from "@/context/UserContext";
import { LanguageWithFlagAndName } from "@/lib/contracts";
import paths from "@/lib/paths";

interface LanguageSelectorLinkProps {
  setShowAllLanguageOptions: Function;
  language: LanguageWithFlagAndName;
  currentPath: string;
}

export default function LanguageSelectorLink({
  setShowAllLanguageOptions,
  language,
  currentPath,
}: LanguageSelectorLinkProps) {
  const { setActiveLanguage } = useUser();

  return (
    <Link
      href={paths.dashboardLanguagePath(language.code)}
      onClick={() => {
        setShowAllLanguageOptions(false);
        setActiveLanguage(language);
      }}
    >
      <Flag
        code={language.flag}
        className={`h-[75px] w-[75px] rounded-full object-cover transition-all hover:scale-110`}
      />
    </Link>
  );
}
