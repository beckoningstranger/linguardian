"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Flag from "react-world-flags";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { SupportedLanguage, User } from "@/types";

interface LanguageSelectorProps {
  user: User;
  setCurrentlyActiveLanguage: Function;
  languageAndFlag: { lang: SupportedLanguage; flag: string };
}

export default function LanguageSelector({
  user,
  setCurrentlyActiveLanguage,
  languageAndFlag,
}: LanguageSelectorProps) {
  const currentPath = usePathname();

  const allOfUsersLanguagesAndFlags: {
    name: SupportedLanguage;
    flagCode: string;
  }[] = user.languages.map((lang) => {
    return { name: lang.code, flagCode: lang.flag };
  });
  const renderedLanguagesAndFlags = allOfUsersLanguagesAndFlags.filter(
    (lang) => lang.name !== languageAndFlag.lang
  );

  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);

  const ref = useOutsideClick(
    () =>
      setShowAllLanguageOptions(
        (showAllLanguageOptions) => !showAllLanguageOptions
      ),
    showAllLanguageOptions
  );

  return (
    <div ref={ref} className="z-50 hidden md:block">
      <div>
        <Flag
          code={languageAndFlag.flag}
          onClick={() =>
            setShowAllLanguageOptions(
              (showAllLanguageOptions) => !showAllLanguageOptions
            )
          }
          className={`rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125 md:h-[50px] md:w-[50px]`}
        />
      </div>
      <div className={`absolute`}>
        {renderedLanguagesAndFlags.map((lang) => (
          <Link key={lang.flagCode} href={`${currentPath}?lang=${lang.name}`}>
            <Flag
              code={lang.flagCode}
              onClick={() => {
                setShowAllLanguageOptions(
                  (showAllLanguageOptions) => !showAllLanguageOptions
                );
                setCurrentlyActiveLanguage(lang.name);
              }}
              className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
                showAllLanguageOptions &&
                "scale-100 h-12 my-2 border-2 border-slate-300"
              }
                `}
            />
          </Link>
        ))}
        {showAllLanguageOptions && renderedLanguagesAndFlags.length < 6 && (
          <AddNewLanguageOption />
        )}
      </div>
    </div>
  );
}
