import { SupportedLanguage, LanguageFeatures } from "@/lib/types";
import Button from "../ui/Button";

interface HelperKeysSelectorProps {
  targetLanguageFeatures: LanguageFeatures;
  handleHelperKeyClick: Function;
  target: SupportedLanguage;
  toggleMobileMenu?: Function;
  mobile: boolean;
}

export default function HelperKeysSelector({
  targetLanguageFeatures,
  handleHelperKeyClick,
  toggleMobileMenu,
  mobile,
}: HelperKeysSelectorProps) {
  return (
    <div
      className={`${
        mobile
          ? "grid grid-cols-3 justify-center gap-x-6 gap-y-3 text-3xl mt-24"
          : "flex justify-center flex-wrap gap-2"
      }`}
    >
      {targetLanguageFeatures.requiresHelperKeys?.map((key) => (
        <Button
          intent="icon"
          color="white"
          key={key}
          className="border-2 border-blue-800"
          // className={`m-2 bg-slate-300 border p-1 ${
          //   mobile ? "w-14 h-14 text-4xl" : "w-10 h-10"
          // }border-2 border-black rounded-md`}
          onClick={(e) => {
            handleHelperKeyClick(e);
            if (mobile) toggleMobileMenu!();
          }}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}
