"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import Flag from "react-world-flags";

interface LanguageSelectorLinkProps {
  setShowAllLanguageOptions: Function;
  showAllLanguageOptions: boolean;
  flag: string;
  language: SupportedLanguage;
  currentPath: string;
}

export default function LanguageSelectorLink({
  setShowAllLanguageOptions,
  showAllLanguageOptions,
  flag,
  language,
  currentPath,
}: LanguageSelectorLinkProps) {
  const { setActiveLanguage } = useActiveLanguage();
  return (
    <Link
      href={calculateNewPath(language, currentPath)}
      onClick={() => {
        setShowAllLanguageOptions(false);
        setActiveLanguage({ name: language, flag });
      }}
    >
      <Flag
        code={flag}
        className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
          showAllLanguageOptions &&
          "scale-100 h-12 my-2 md:border border-slate-300"
        }
`}
      />
    </Link>
  );
}

export function calculateNewPath(language: SupportedLanguage, oldPath: string) {
  return "/" + language + "/" + oldPath.split("/").slice(2).join("/");
}
