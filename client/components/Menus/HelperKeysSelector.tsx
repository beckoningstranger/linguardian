"use client";

import { LanguageFeatures, SupportedLanguage } from "@linguardian/shared/contracts";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useMobileMenu } from "@/context/MobileMenuContext";

interface HelperKeysSelectorProps {
  targetLanguageFeatures: LanguageFeatures;
  handleHelperKeyClick: Function;
  target: SupportedLanguage;
  mobile: boolean;
}

export default function HelperKeysSelector({
  targetLanguageFeatures,
  handleHelperKeyClick,
  mobile,
}: HelperKeysSelectorProps) {
  const { closeMobileMenu } = useMobileMenu();
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
        {targetLanguageFeatures.helperKeys?.map((key) => (
          <Button
            intent="icon"
            color="white"
            key={key}
            className={cn(
              "bg-white border p-1 text-hmd font-serif rounded-md drop-shadow-lg size-20"
            )}
            onClick={(e) => {
              handleHelperKeyClick(e);
              if (mobile) closeMobileMenu();
            }}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}
