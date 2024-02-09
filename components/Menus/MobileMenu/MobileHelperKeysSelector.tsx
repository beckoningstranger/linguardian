import {
  SupportedLanguage,
  languageFeatures,
} from "@/app/context/GlobalContext";

interface MobileLanguageSelectorProps {
  toggleMobileMenu: Function;
  activeLanguage: SupportedLanguage;
  handleHelperKeyClick: Function;
}

export default function MobileHelperKeysSelector({
  toggleMobileMenu,
  activeLanguage,
  handleHelperKeyClick,
}: MobileLanguageSelectorProps) {
  const helperKeys = languageFeatures[activeLanguage].requiresHelperKeys!;

  console.log("MHKS");

  return (
    <div className="flex justify-center flex-wrap">
      {helperKeys.map((key) => (
        <button
          key={key}
          className="m-2 bg-slate-200 p-1 w-10 h-10 border-2 border-black rounded-md"
          onClick={(e) => {
            handleHelperKeyClick(e);
            toggleMobileMenu("off");
          }}
        >
          {key}
        </button>
      ))}
    </div>
    // <div className="grid grid-cols-3 gap-4">
    //   {languagesAndFlags.map((lang, index) => {
    //     return (
    //       <Flag
    //         key={languagesAndFlags[index][0]}
    //         code={languagesAndFlags[index][1]}
    //         onClick={() => {
    //           setCurrentlyActiveLanguage!(languagesAndFlags[index][0]);
    //           toggleMobileMenuOff!();
    //         }}
    //         className={`rounded-full object-cover w-24 h-24 border-2 border-slate-300`}
    //       />
    //     );
    //   })}
    // </div>
  );
}
