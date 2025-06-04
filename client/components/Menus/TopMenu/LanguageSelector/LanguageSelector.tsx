"use client";

import { usePathname } from "next/navigation";
import { RefObject, useState } from "react";
import Flag from "react-world-flags";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { MAX_NUMBER_OF_LANGUAGES_ALLOWED } from "@/lib/constants";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import useUserOnClient from "@/lib/hooks/useUserOnClient";
import { siteSettings } from "@/lib/siteSettings";
import AddNewLanguageOption from "./AddNewLanguageOption";
import LanguageSelectorLink from "./LanguageSelectorLink";

export default function LanguageSelector() {
  const currentBaseUrl = usePathname();
  const { activeLanguage } = useActiveLanguage();

  const user = useUserOnClient();
  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);
  const currentPath = usePathname();
  const amountOfSupportedLanguages = siteSettings.supportedLanguages.length;

  const allLanguagesAndFlagsUserIsLearning = user?.learnedLanguages || [];

  const amountOfLanguagesUserLearns = Object.keys(
    allLanguagesAndFlagsUserIsLearning
  ).length;

  const allLanguageAndFlagExceptActive =
    allLanguagesAndFlagsUserIsLearning.filter(
      (lang) => lang.code !== activeLanguage?.code
    );

  const ref = useOutsideClick(
    () =>
      setShowAllLanguageOptions(
        (showAllLanguageOptions) => !showAllLanguageOptions
      ),
    showAllLanguageOptions
  );

  if (!siteSettings.showLanguageSelectorOnlyOn.includes(currentBaseUrl))
    return null;
  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="z-50 hidden tablet:block"
    >
      <div>
        <Flag
          code={activeLanguage?.flag}
          onClick={() =>
            setShowAllLanguageOptions(
              (showAllLanguageOptions) => !showAllLanguageOptions
            )
          }
          className={`h-[75px] w-[75px] rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110`}
        />
      </div>
      {showAllLanguageOptions && (
        <div className={`absolute mt-4 grid animate-from-here gap-4`}>
          {allLanguageAndFlagExceptActive.map((lang) => {
            if (!lang) return;
            return (
              <LanguageSelectorLink
                setShowAllLanguageOptions={setShowAllLanguageOptions}
                language={lang}
                currentPath={currentPath}
                key={lang.flag}
              />
            );
          })}
          {allLanguageAndFlagExceptActive.length <
            MAX_NUMBER_OF_LANGUAGES_ALLOWED &&
            moreLanguagesToLearn(
              amountOfLanguagesUserLearns,
              amountOfSupportedLanguages
            ) && <AddNewLanguageOption />}
        </div>
      )}
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
