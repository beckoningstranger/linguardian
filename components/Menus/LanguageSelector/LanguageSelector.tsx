"use client";

import useGlobalContext from "@/app/hooks/useGlobalContext";
import { useState } from "react";
import Flag from "react-world-flags";
import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import AddNewLanguageOption from "./AddNewLanguageOption";

export default function LanguageSelector() {
  const { user, currentlyActiveLanguage, setCurrentlyActiveLanguage } =
    useGlobalContext();

  const languages = user.languages.map((lang) => lang.name);
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
    <div ref={ref} className="hidden md:block z-50">
      <div>
        <Flag
          code={currentlyActiveLanguage!}
          onClick={() => handleFlagSelected(currentlyActiveLanguage!)}
          className={`transition-all rounded-full object-cover w-[50px] h-[50px] m-0 border-2 border-slate-300 hover:scale-125`}
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
                className={`scale-0 transition-all rounded-full object-cover hover:scale-125 w-12 ${
                  active && "scale-100 h-12 my-2 border-2 border-slate-300"
                }  
                h-0 w-0
                `}
              />
            );
          }
        })}
        {active && languages!.length < 6 && <AddNewLanguageOption />}
      </div>
    </div>
  );
}
