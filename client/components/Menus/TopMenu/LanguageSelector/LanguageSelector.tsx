"use client";

import { useState } from "react";
import Flag from "react-world-flags";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { usePathname } from "next/navigation";
import { SupportedLanguage, User } from "@/types";
import Link from "next/link";

interface LanguageSelectorProps {
  user: User;
  currentlyActiveLanguage: SupportedLanguage;
  setCurrentlyActiveLanguage: Function;
}

export default function LanguageSelector({
  user,
  currentlyActiveLanguage,
  setCurrentlyActiveLanguage,
}: LanguageSelectorProps) {
  const currentPath = usePathname();

  // This is used to determine which options need to be shown in the language selector
  const usersLanguagesAndFlags: {
    name: SupportedLanguage;
    flagCode: string;
  }[] = user.languages.map((lang) => {
    return { name: lang.code, flagCode: lang.flag };
  });
  const renderedLanguagesAndFlags = usersLanguagesAndFlags.filter(
    (lang) => lang.name !== currentlyActiveLanguage
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
          // This is a workaround
          code={
            currentlyActiveLanguage === "EN" ? "GB" : currentlyActiveLanguage
          }
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
