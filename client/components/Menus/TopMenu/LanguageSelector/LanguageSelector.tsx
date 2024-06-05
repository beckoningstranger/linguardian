"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Flag from "react-world-flags";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { SupportedLanguage, User } from "@/types";
import { useSession } from "next-auth/react";
import LanguageSelectorLink from "./LanguageSelectorLink";

interface LanguageSelectorProps {
  user: User;
  setCurrentlyActiveLanguage: Function;
  activeLanguageData: { name: SupportedLanguage; flag: string };
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelector({
  user,
  setCurrentlyActiveLanguage,
  activeLanguageData,
  allSupportedLanguages,
}: LanguageSelectorProps) {
  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const MAX_NUMBER_OF_LANGUAGES_ALLOWED = 6;
  const currentPath = usePathname();
  const amountOfSupportedLanguages = allSupportedLanguages.length;

  const allOfUsersLanguagesAndFlags: {
    name: SupportedLanguage;
    flag: string;
  }[] = user.languages.map((lang) => {
    return { name: lang.code, flag: lang.flag };
  });

  const sessionUserNative: { name: SupportedLanguage; flag: string } =
    useSession().data?.user.native;
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
        {currentPath.includes("dictionary") &&
          sessionUserNative?.name &&
          activeLanguageData?.name &&
          activeLanguageData.name !== sessionUserNative.name && (
            <LanguageSelectorLink
              setShowAllLanguageOptions={setShowAllLanguageOptions}
              showAllLanguageOptions={showAllLanguageOptions}
              flag={sessionUserNative.flag}
              language={sessionUserNative.name}
              currentPath={currentPath}
              setCurrentlyActiveLanguage={setCurrentlyActiveLanguage}
              key={sessionUserNative.flag}
            />
          )}
        {showAllLanguageOptions &&
          allLanguageAndFlagExceptActive.length <
            MAX_NUMBER_OF_LANGUAGES_ALLOWED &&
          moreLanguagesToLearn(user, amountOfSupportedLanguages) && (
            <AddNewLanguageOption />
          )}
      </div>
    </div>
  );
}

export function moreLanguagesToLearn(
  user: User,
  amountOfSupportedLanguages: number
): Boolean {
  const amountOfLanguagesUserLearns = user.languages.length;
  const amountOfLanguagesThatCanBeLearned = amountOfSupportedLanguages - 1; // native language has to be deducted
  if (amountOfLanguagesUserLearns >= amountOfLanguagesThatCanBeLearned)
    return false;
  return true;
}
