"use client";

import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";
import Flag from "react-world-flags";

import { useOutsideClick } from "@/hooks/useOutsideClick";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import AddNewLanguageOption from "./AddNewLanguageOption";
import LanguageSelectorLink from "./LanguageSelectorLink";
import { useSession } from "next-auth/react";

interface LanguageSelectorProps {
  activeLanguageData: { name: SupportedLanguage; flag: string };
  allSupportedLanguages: SupportedLanguage[];
}

export default function LanguageSelector({
  activeLanguageData,
  allSupportedLanguages,
}: LanguageSelectorProps) {
  const sessionUser = useSession().data?.user as SessionUser;
  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const MAX_NUMBER_OF_LANGUAGES_ALLOWED = 6;
  const currentPath = usePathname();
  const amountOfSupportedLanguages = allSupportedLanguages.length;

  const allLanguagesAndFlagsUserIsLearning: {
    name: SupportedLanguage;
    flag: string;
  }[] = sessionUser?.isLearning || [];

  const amountOfLanguagesUserLearns = Object.keys(
    allLanguagesAndFlagsUserIsLearning
  ).length;

  const allLanguageAndFlagExceptActive =
    allLanguagesAndFlagsUserIsLearning.filter(
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
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="z-50 hidden md:block"
    >
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
): boolean {
  const amountOfLanguagesThatCanBeLearned = amountOfSupportedLanguages - 1; // native language has to be deducted
  if (amountOfLanguagesUserLearns >= amountOfLanguagesThatCanBeLearned)
    return false;
  return true;
}
