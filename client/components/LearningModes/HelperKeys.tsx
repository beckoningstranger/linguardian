import { LanguageFeatures } from "@/types";
import HelperKeysSelector from "../Menus/HelperKeysSelector";
import MobileMenu from "../Menus/MobileMenu/MobileMenu";
import { RefObject, useContext, useState } from "react";
import { MobileMenuContext } from "../Menus/MobileMenu/MobileMenuContext";
import { MoreReviewsMode } from "./MoreReviews";

interface HelperKeysProps {
  targetLanguageFeatures: LanguageFeatures;
  moreReviews: MoreReviewsMode | null;
  itemPresentation: boolean | undefined;
  solution: string;
  setSolution: Function;
  inputRef: RefObject<HTMLInputElement>;
}

export default function HelperKeys({
  targetLanguageFeatures,
  moreReviews,
  itemPresentation,
  solution,
  setSolution,
  inputRef,
}: HelperKeysProps) {
  const { toggleMobileMenu } = useContext(MobileMenuContext);

  const [showHelperKeys, setShowHelperKeys] = useState<boolean>(false);

  const handleHelperKeyClick = (e: React.MouseEvent) => {
    setSolution(solution + (e.target as HTMLButtonElement).innerText);
    setShowHelperKeys(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      {targetLanguageFeatures.requiresHelperKeys &&
        !showHelperKeys &&
        !moreReviews &&
        !itemPresentation && (
          <>
            <div
              className="hidden rounded-md bg-slate-200 p-2 text-center md:block"
              onClick={() => setShowHelperKeys(true)}
            >
              Need help entering special characters?
            </div>
            <div
              className="rounded-md bg-slate-200 p-2 text-center md:hidden"
              onClick={() => toggleMobileMenu!()}
            >
              Need help entering special characters?
            </div>
          </>
        )}
      <MobileMenu>
        <HelperKeysSelector
          target={targetLanguageFeatures.langCode}
          handleHelperKeyClick={handleHelperKeyClick}
          toggleMobileMenu={toggleMobileMenu!}
          targetLanguageFeatures={targetLanguageFeatures}
          mobile={true}
        />
      </MobileMenu>
      {targetLanguageFeatures.requiresHelperKeys && showHelperKeys && (
        <HelperKeysSelector
          target={targetLanguageFeatures.langCode}
          handleHelperKeyClick={handleHelperKeyClick}
          targetLanguageFeatures={targetLanguageFeatures}
          mobile={false}
        />
      )}
    </>
  );
}
