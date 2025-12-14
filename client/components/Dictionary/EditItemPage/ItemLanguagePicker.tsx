"use client";

import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import Flag from "react-world-flags";

import ConfirmLanguageChange from "@/components/Dictionary/EditItemPage/ConfirmLanguageChange";
import FormErrors from "@/components/Forms/FormErrors";
import { useUser } from "@/context/UserContext";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "@linguardian/shared/contracts";

interface ItemLanguagePickerProps {
  isNewItem: boolean;
  activeFlag?: string;
  staticFlag: boolean;
}

export default function ItemLanguagePicker({
  isNewItem,
  activeFlag,
  staticFlag,
}: ItemLanguagePickerProps) {
  const { user } = useUser();

  if (!user) throw new Error("Could not get user from context");
  const allUserLanguages = [user.native, ...user.learnedLanguages];
  const {
    control,
    formState: { errors },
  } = useFormContext<ItemWithPopulatedTranslations>();

  const { field } = useController({
    name: "language",
    control,
  });

  const [pendingLanguage, setPendingLanguage] =
    useState<SupportedLanguage | null>(null);

  const languageCode = field.value;
  const setLanguageCode = field.onChange;

  if (staticFlag)
    return (
      <Flag
        code={activeFlag}
        className="size-12 rounded-full border-2 border-slate-300 object-cover"
      />
    );

  return (
    <div id="languagePicker" className="flex gap-4">
      {allUserLanguages.map((lang) => {
        return (
          <Flag
            code={lang.flag}
            key={lang.code}
            className={`my-2 size-12 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110 hover:grayscale-0 ${
              languageCode === lang.code ? "scale-110" : "scale-90 grayscale"
            }`}
            onClick={() => {
              if (isNewItem) {
                setLanguageCode(lang.code);
              } else {
                setPendingLanguage(lang.code);
              }
            }}
          />
        );
      })}
      {pendingLanguage && pendingLanguage !== languageCode && (
        <ConfirmLanguageChange
          confirmFunction={() => {
            setLanguageCode(pendingLanguage);
            setPendingLanguage(null);
          }}
          closeFunction={() => setPendingLanguage(null)}
        />
      )}
      <FormErrors field="language" errors={errors} />
    </div>
  );
}
