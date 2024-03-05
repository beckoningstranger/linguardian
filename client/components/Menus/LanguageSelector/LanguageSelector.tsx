"use client";

import useGlobalContext from "@/app/hooks/useGlobalContext";
import { useState } from "react";
import Flag from "react-world-flags";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";
import { languageFeatures } from "@/app/context/GlobalContext";

export default function LanguageSelector() {
  const { user, currentlyActiveLanguage, setCurrentlyActiveLanguage } =
    useGlobalContext();

  // This way, languagesAndFlag[index][0] will be the language code, and languages[index][1] will be the flag code
  const languagesAndFlags = user.languages.map((lang) => [
    lang.code,
    languageFeatures[lang.code].flagCode,
  ]);

  const [active, setActive] = useState(false);

  const toggleLanguageSelector = () => {
    setActive((active) => !active);
  };

  const ref = useOutsideClick(toggleLanguageSelector!, active);

  const handleFlagSelected = (language: string): void => {
    setActive((active) => !active);
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
        {languagesAndFlags.map((flag, index) => {
          if (languagesAndFlags[index][0] !== currentlyActiveLanguage) {
            return (
              <Flag
                key={languagesAndFlags[index][1]}
                code={languagesAndFlags[index][1]}
                onClick={() => handleFlagSelected(languagesAndFlags[index][0])}
                className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
                  active && "scale-100 h-12 my-2 border-2 border-slate-300"
                }
                `}
              />
            );
          }
        })}
        {active && languagesAndFlags.length < 6 && <AddNewLanguageOption />}
      </div>
    </div>
  );
}
