import Flag from "react-world-flags";
import AddNewLanguageOption from "./AddNewLanguageOption";
import {
  SupportedLanguage,
  languageFeatures,
} from "@/app/context/GlobalContext";

interface MobileLanguageSelectorProps {
  languages: SupportedLanguage[];
  setCurrentlyActiveLanguage: Function;
  toggleMobileMenu: Function;
}

export default function MobileLanguageSelector({
  languages,
  setCurrentlyActiveLanguage,
  toggleMobileMenu,
}: MobileLanguageSelectorProps) {
  // This way, languagesAndFlag[index][0] will be the language code, and languages[index][1] will be the flag code
  const languagesAndFlags = languages.map((lang) => [
    lang,
    languageFeatures[lang].flagCode,
  ]);

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-8 pt-28">
      {languagesAndFlags.map((lang, index) => {
        return (
          <Flag
            key={languagesAndFlags[index][0]}
            code={languagesAndFlags[index][1]}
            onClick={() => {
              setCurrentlyActiveLanguage!(languagesAndFlags[index][0]);
              toggleMobileMenu();
            }}
            className={`rounded-full object-cover w-24 h-24 border-2 border-slate-300`}
          />
        );
      })}
      {languages.length < 6 && <AddNewLanguageOption />}
    </div>
  );
}
