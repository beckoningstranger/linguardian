"use client";

import useGlobalContext from "@/app/hooks/useGlobalContext";
import { useState } from "react";
import Flag from "react-world-flags";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import CurrentlyActiveFlag from "./LanguageSelector/CurrentlyActiveFlag";
import MobileMenu from "./MobileMenu";

export default function LanguageSelector() {
  const {
    userLanguages: languages,
    currentlyActiveLanguage,
    setCurrentlyActiveLanguage,
  } = useGlobalContext();

  const [active, setActive] = useState(false);

  const toggleLanguageSelector = () => {
    setActive((active) => !active);
  };

  const ref = useOutsideClick(toggleLanguageSelector!, active);

  const handleFlagSelected = (language: String): void => {
    setActive((active) => !active);
    setCurrentlyActiveLanguage!(language);
  };

  return (
    <div ref={ref} className="hidden md:block">
      <div>
        <CurrentlyActiveFlag
          currentlyActiveLanguage={currentlyActiveLanguage!}
          handleFlagSelected={handleFlagSelected}
        />
      </div>
      <div className={`absolute `}>
        {languages!.map((language) => {
          if (language !== currentlyActiveLanguage) {
            return (
              <Flag
                key={language}
                code={language}
                onClick={() => handleFlagSelected(language)}
                className={`scale-0 transition-all rounded-full object-cover w-[80px] md:w-[50px] ${
                  active &&
                  "scale-100 h-[80px] md:h-[50px] my-2 border-2 border-slate-300"
                }  
                h-0 w-0
                `}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
