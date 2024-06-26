"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Flag from "react-world-flags";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import LanguageSelectorLink from "./LanguageSelectorLink";
import { useSession } from "next-auth/react";

interface LanguageSelectorProps {
  setCurrentlyActiveLanguage: Function;
  activeLanguageData: { name: SupportedLanguage; flag: string };
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelector({
  setCurrentlyActiveLanguage,
  activeLanguageData,
  allSupportedLanguages,
}: LanguageSelectorProps) {
  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const MAX_NUMBER_OF_LANGUAGES_ALLOWED = 6;
  const currentPath = usePathname();
  const amountOfSupportedLanguages = allSupportedLanguages.length;
  const sessionUser = useSession().data?.user as SessionUser;

  const allOfUsersLanguagesAndFlags: {
    name: SupportedLanguage;
    flag: string;
  }[] = sessionUser?.isLearning
    ? sessionUser.isLearning
    : [{ name: "DE" as SupportedLanguage, flag: "XX" }];
  // The above looks redundant, but app will not build without

  const amountOfLanguagesUserLearns = Object.keys(
    allOfUsersLanguagesAndFlags
  ).length;

  const allLanguageAndFlagExceptActive = allOfUsersLanguagesAndFlags.filter(
    (lang) => lang.name !== activeLanguageData.name
  );

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
          code={activeLanguageData.flag}
          onClick={() =>
            setShowAllLanguageOptions(
              (showAllLanguageOptions) => !showAllLanguageOptions
            )
          }
          className={`rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125 md:h-[50px] md:w-[50px]`}
        />
      </div>
      <div className={`absolute`}>
        {allLanguageAndFlagExceptActive.map((lang) => {
          if (!lang) return;
          return (
            <LanguageSelectorLink
              setShowAllLanguageOptions={setShowAllLanguageOptions}
              showAllLanguageOptions={showAllLanguageOptions}
              flag={lang.flag}
              language={lang.name}
              currentPath={currentPath}
              setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
              key={lang.flag}
            />
          );
        })}
        {showAllLanguageOptions &&
          allLanguageAndFlagExceptActive.length <
            MAX_NUMBER_OF_LANGUAGES_ALLOWED &&
          moreLanguagesToLearn(
            amountOfLanguagesUserLearns,
            amountOfSupportedLanguages
          ) && <AddNewLanguageOption />}
      </div>
    </div>
  );
}

export function moreLanguagesToLearn(
  amountOfLanguagesUserLearns: number,
  amountOfSupportedLanguages: number
): Boolean {
  const amountOfLanguagesThatCanBeLearned = amountOfSupportedLanguages - 1; // native language has to be deducted
  if (amountOfLanguagesUserLearns >= amountOfLanguagesThatCanBeLearned)
    return false;
  return true;
}
