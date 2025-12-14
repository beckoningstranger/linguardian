"use client";

import { SupportedLanguage } from "@linguardian/shared/contracts";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { getFlagCodeFromLangCode } from "@/lib/utils";
import { Dispatch, RefObject, SetStateAction } from "react";
import Flag from "react-world-flags";

type TinyLanguagePickerProps = {
  languages: SupportedLanguage[];
  onClick: (lang: SupportedLanguage) => void;
  setShowLanguagePicker: Dispatch<SetStateAction<boolean>>;
};

export default function TinyLanguagePicker({
  languages,
  onClick,
  setShowLanguagePicker,
}: TinyLanguagePickerProps) {
  const ref = useOutsideClick(() => setShowLanguagePicker(false));
  return (
    <div
      className="flex size-full w-[300px] gap-4 rounded-md border bg-white px-3 py-2 shadow-md"
      onClick={() => setShowLanguagePicker((prev) => !prev)}
      ref={ref as RefObject<HTMLDivElement>}
    >
      {languages.map((lang) => (
        <button key={lang} onClick={() => {}}>
          <Flag
            code={getFlagCodeFromLangCode(lang)}
            className="size-6 rounded-full object-cover"
            onClick={() => onClick(lang)}
          />
        </button>
      ))}
    </div>
  );
}
