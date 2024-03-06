"use client";

import useGlobalContext from "@/app/hooks/useGlobalContext";
import { useState } from "react";
import Flag from "react-world-flags";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { usePathname } from "next/navigation";
import { languageFeatures } from "@/app/context/GlobalContext";
import { SupportedLanguage } from "@/types";
import Link from "next/link";

export default function LanguageSelector() {
  const currentPath = usePathname();
  const { user, currentlyActiveLanguage, setCurrentlyActiveLanguage } =
    useGlobalContext();

  const languagesAndFlags: { name: SupportedLanguage; flagCode: string }[] = [];
  user.languages.map((lang) =>
    languagesAndFlags.push({
      name: lang.code,
      flagCode: languageFeatures[lang.code].flagCode,
    })
  );

  const [showAllLanguageOptions, setShowAllLanguageOptions] = useState(false);

  const toggleLanguageSelector = () => {
    setShowAllLanguageOptions(
      (showAllLanguageOptions) => !showAllLanguageOptions
    );
  };

  const ref = useOutsideClick(toggleLanguageSelector!, showAllLanguageOptions);

  const handleFlagSelected = (language: string): void => {
    // Close language selector
    setShowAllLanguageOptions(
      (showAllLanguageOptions) => !showAllLanguageOptions
    );
    // Set new currently active language
    if (setCurrentlyActiveLanguage) setCurrentlyActiveLanguage(language);
  };

  return (
    <div ref={ref} className="z-50 hidden md:block">
      <div>
        <Flag
          code={languageFeatures[currentlyActiveLanguage].flagCode}
          onClick={() => handleFlagSelected(currentlyActiveLanguage!)}
          className={`rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125 md:h-[50px] md:w-[50px]`}
        />
      </div>
      <div className={`absolute`}>
        {languagesAndFlags.map((lang) => {
          if (lang.name !== currentlyActiveLanguage) {
            return (
              <Link
                key={lang.flagCode}
                href={`${currentPath}?lang=${lang.name}`}
              >
                <Flag
                  code={lang.flagCode}
                  onClick={() => handleFlagSelected(lang.name)}
                  className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
                    showAllLanguageOptions &&
                    "scale-100 h-12 my-2 border-2 border-slate-300"
                  }
                `}
                />
              </Link>
            );
          }
        })}
        {showAllLanguageOptions && languagesAndFlags.length < 6 && (
          <AddNewLanguageOption />
        )}
      </div>
    </div>
  );
}
