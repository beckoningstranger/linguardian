"use client";

import { Button } from "@headlessui/react";
import { RefObject, useState } from "react";

import HelperKeysSelector from "@/components/Menus/HelperKeysSelector";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { LanguageFeatures } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface HelperKeysProps {
  targetLanguageFeatures: LanguageFeatures;
  solution: string;
  setSolution: Function;
  inputRef: RefObject<HTMLInputElement>;
}

export default function HelperKeys({
  targetLanguageFeatures,
  solution,
  setSolution,
  inputRef,
}: HelperKeysProps) {
  const { openMobileMenu } = useMobileMenu();

  const [showHelperKeys, setShowHelperKeys] = useState<boolean>(false);

  const handleHelperKeyClick = (e: React.MouseEvent) => {
    setSolution(solution + (e.target as HTMLButtonElement).innerText);
    setShowHelperKeys(false);
    if (inputRef.current) inputRef.current.focus();
  };

  if (!targetLanguageFeatures.requiresHelperKeys) return null;

  const needHelpButtonStyling =
    "w-full bg-white/95 mt-1 tablet:text-cxlm text-clgm py-8";
  return (
    <>
      {/* </MobileMenu> */}
      {showHelperKeys && (
        <HelperKeysSelector
          target={targetLanguageFeatures.langCode}
          handleHelperKeyClick={handleHelperKeyClick}
          targetLanguageFeatures={targetLanguageFeatures}
          mobile={false}
        />
      )}
      {!showHelperKeys && (
        <>
          <Button
            className={cn(needHelpButtonStyling, "hidden tablet:block")}
            onClick={() => setShowHelperKeys(true)}
          >
            Need help entering special characters?
          </Button>
          <Button
            className={cn(needHelpButtonStyling, "tablet:hidden text-cmdm")}
            onClick={() => {
              openMobileMenu(
                <HelperKeysSelector
                  target={targetLanguageFeatures.langCode}
                  handleHelperKeyClick={handleHelperKeyClick}
                  targetLanguageFeatures={targetLanguageFeatures}
                  mobile={true}
                />
              );
            }}
          >
            Need help entering special characters?
          </Button>
        </>
      )}
    </>
  );
}
