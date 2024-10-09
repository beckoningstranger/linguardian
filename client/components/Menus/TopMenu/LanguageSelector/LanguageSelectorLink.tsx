"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { LanguageWithFlagAndName, SupportedLanguage, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Flag from "react-world-flags";

interface LanguageSelectorLinkProps {
  setShowAllLanguageOptions: Function;
  showAllLanguageOptions: boolean;
  language: LanguageWithFlagAndName;
  currentPath: string;
}

export default function LanguageSelectorLink({
  setShowAllLanguageOptions,
  showAllLanguageOptions,
  language,
  currentPath,
}: LanguageSelectorLinkProps) {
  const { setActiveLanguage } = useActiveLanguage();
  const { data, update } = useSession();
  const user = data?.user as User;

  return (
    <Link
      href={calculateNewPath(language.code, currentPath)}
      onClick={() => {
        setShowAllLanguageOptions(false);
        setActiveLanguage(language);
        update({
          ...data,
          user: {
            ...user,
            activeLanguageAndFlag: language,
          },
        });
      }}
    >
      <Flag
        code={language.flag}
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
