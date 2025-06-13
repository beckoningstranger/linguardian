import { SupportedLanguage, LanguageFeatures } from "@/lib/types";
import Button from "../ui/Button";
import { cn } from "@/lib/helperFunctionsClient";

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
      className={cn("flex justify-center gap-2 p-4 w-full", mobile && "mt-20")}
      id="HelperKeys"
    >
      <div
        className={cn(
          !mobile && "flex flex-wrap",
          mobile && "grid grid-cols-4",
          "max-w-[500px] justify-center gap-2"
        )}
      >
        {targetLanguageFeatures.requiresHelperKeys?.map((key) => (
          <Button
            intent="icon"
            color="white"
            key={key}
            className={cn(
              "bg-white border p-1 text-hmd font-serif rounded-md drop-shadow-lg size-20"
            )}
            onClick={(e) => {
              handleHelperKeyClick(e);
              if (mobile) toggleMobileMenu!();
            }}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}
