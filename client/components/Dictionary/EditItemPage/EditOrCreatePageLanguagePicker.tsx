"use client";

import { useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import Flag from "react-world-flags";

import { LanguageWithFlagAndName, SupportedLanguage } from "@/lib/types";
import { FormErrors } from "../../ui/FormErrors";
import ConfirmLanguageChange from "./ConfirmLanguageChange";

interface LanguagePickerProps {
  userLanguages: LanguageWithFlagAndName[];
  setValue: Function;
  itemLanguage: SupportedLanguage;
  isNewItem: boolean;
  setItemLanguage: Function;
  errors: FieldErrors<FieldValues>;
  staticFlag?: string;
}

export default function LanguagePicker({
  userLanguages,
  setValue,
  itemLanguage,
  isNewItem,
  setItemLanguage,
  errors,
  staticFlag,
}: LanguagePickerProps) {
  const [showConfirmLanguageChange, setShowConfirmLanguageChange] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    SupportedLanguage | undefined
  >(undefined);

  const allUserLanguages = Object.values(userLanguages).flat();

  useEffect(() => {
    setValue("language", itemLanguage, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [itemLanguage, setValue]);

  if (staticFlag)
    return (
      <Flag
        code={staticFlag}
        className="my-2 size-12 rounded-full border-2 border-slate-300 object-cover"
      />
    );

  return (
    <div id="languagePicker" className="flex gap-4">
      {allUserLanguages.map((lang) => (
        <Flag
          code={lang.flag}
          key={lang.code}
          className={`my-2 size-12 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110  hover:grayscale-0 ${
            itemLanguage === lang.code ? "scale-110" : "scale-90 grayscale"
          }`}
          onClick={() => {
            if (isNewItem) {
              setItemLanguage(lang.code);
              return;
            } else {
              setSelectedLanguage(lang.code);
              setShowConfirmLanguageChange(true);
            }
          }}
        />
      ))}
      {showConfirmLanguageChange &&
        selectedLanguage &&
        selectedLanguage !== itemLanguage && (
          <ConfirmLanguageChange
            confirmFunction={() => setItemLanguage(selectedLanguage)}
            closeFunction={() => setShowConfirmLanguageChange(false)}
          />
        )}
      <FormErrors field="language" errors={errors} />
    </div>
  );
}
