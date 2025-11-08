"use client";

import Link from "next/link";
import Flag from "react-world-flags";

import { useUser } from "@/context/UserContext";
import { LanguageWithFlagAndName } from "@/lib/contracts";
import { usePathname } from "next/navigation";

interface LanguageSelectorLinkProps {
  setShowAllLanguageOptions: Function;
  language: LanguageWithFlagAndName;
}

export default function LanguageSelectorLink({
  setShowAllLanguageOptions,
  language,
}: LanguageSelectorLinkProps) {
  const { setActiveLanguage } = useUser();
  const currentPath = usePathname();
  const href = currentPath.slice(0, -2) + language.code;

  return (
    <Link
      href={href}
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
