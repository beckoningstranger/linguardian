"use client";

import { SupportedLanguage, UserLanguagesWithFlags } from "@/lib/types";
import { useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import Flag from "react-world-flags";
import ConfirmLanguageChange from "./ConfirmLanguageChange";
import FormErrors from "./FormErrors";

interface LanguagePickerProps {
  userLanguagesWithFlags: UserLanguagesWithFlags;
  setValue: Function;
  itemLanguage: SupportedLanguage;
  isNewItem: boolean;
  setItemLanguage: Function;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  staticFlag?: string;
}

export default function LanguagePicker({
  userLanguagesWithFlags,
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

  const allUserLanguagesWithFlags = Object.values(
    userLanguagesWithFlags
  ).flat();

  useEffect(() => {
    setValue("language", itemLanguage, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [itemLanguage, setValue]);

  if (staticFlag)
    return (
      <div className="ml-4 flex w-full justify-evenly gap-4 rounded-md text-center sm:justify-start">
        <Flag
          code={staticFlag}
          className="my-2 h-12 w-12 rounded-full border-2 border-slate-300 object-cover"
        />
      </div>
    );

  return (
    <div className="ml-4 flex w-full justify-evenly gap-4 rounded-md text-center sm:justify-start">
      {allUserLanguagesWithFlags.map((lwf) => (
        <Flag
          code={lwf.flag}
          key={lwf.name}
          className={`my-2 h-12 w-12 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125  hover:grayscale-0 ${
            itemLanguage === lwf.name ? "scale-125" : "scale-90 grayscale"
          }`}
          onClick={() => {
            if (isNewItem) {
              setItemLanguage(lwf.name);
              return;
            } else {
              setSelectedLanguage(lwf.name);
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
      <FormErrors errors={errors} />
    </div>
  );
}