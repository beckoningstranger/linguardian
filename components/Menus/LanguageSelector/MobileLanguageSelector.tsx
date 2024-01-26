import Flag from "react-world-flags";
import AddNewLanguageOption from "./AddNewLanguageOption";

interface MobileLanguageSelectorProps {
  languages: string[];
  setCurrentlyActiveLanguage: Function;
  toggleMobileMenuOff: Function;
}

export default function MobileLanguageSelector({
  languages,
  setCurrentlyActiveLanguage,
  toggleMobileMenuOff,
}: MobileLanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-8 pt-28">
      {languages!.map((language) => {
        return (
          <Flag
            key={language}
            code={language}
            onClick={() => {
              setCurrentlyActiveLanguage!(language);
              toggleMobileMenuOff!();
            }}
            className={`rounded-full object-cover w-24 h-24 border-2 border-slate-300`}
          />
        );
      })}
      {languages!.length < 6 && <AddNewLanguageOption />}
    </div>
  );
}
