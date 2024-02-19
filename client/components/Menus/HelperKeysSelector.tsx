import {
  SupportedLanguage,
  LanguageFeatures,
} from "@/app/context/GlobalContext";

interface HelperKeysSelectorProps {
  languageFeatures: Record<SupportedLanguage, LanguageFeatures>;
  handleHelperKeyClick: Function;
  target: SupportedLanguage;
  toggleMobileMenu?: Function;
  mobile: Boolean;
}

export default function HelperKeysSelector({
  languageFeatures,
  target,
  handleHelperKeyClick,
  toggleMobileMenu,
  mobile,
}: HelperKeysSelectorProps) {
  return (
    <div
      className={`${
        mobile
          ? "grid grid-cols-3 justify-center gap-x-6 gap-y-3 text-3xl mt-24"
          : "flex justify-center flex-wrap"
      }`}
    >
      {languageFeatures[target].requiresHelperKeys?.map((key) => (
        <button
          key={key}
          className={`m-2 bg-slate-300 border p-1 ${
            mobile ? "w-14 h-14 text-4xl" : "w-10 h-10"
          }border-2 border-black rounded-md`}
          onClick={(e) => {
            handleHelperKeyClick(e);
            if (mobile) toggleMobileMenu!();
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
