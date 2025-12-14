"use client";

import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

import ComboBoxWrapper from "@/components/Dictionary/EditItemPage/ComboBoxWrapper";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "@linguardian/shared/contracts";
import { allLanguageFeatures } from "@linguardian/shared/constants";

interface EditPartOfSpeechGenderAndCaseProps {
  control: Control<
    ItemWithPopulatedTranslations,
    any,
    ItemWithPopulatedTranslations
  >;
  watch: Function;
  errors: FieldErrors<FieldValues>;
  itemLanguage: SupportedLanguage;
}

export default function EditPartOfSpeechGenderAndCase({
  watch,
  control,
  errors,
  itemLanguage,
}: EditPartOfSpeechGenderAndCaseProps) {
  const { partsOfSpeech, hasGender, genders, hasCases, cases } =
    allLanguageFeatures.find((lang) => lang.langCode === itemLanguage)!;
  return (
    <div id="partOfSpeech">
      <div className="text-csmb font-semibold">Part of Speech</div>
      <div className="flex flex-col gap-2 phone:flex-row">
        {watch().partOfSpeech === "noun" && hasGender && (
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <ComboBoxWrapper
                placeholder="Noun gender"
                value={value ? value : ""}
                onChange={onChange}
                formField="gender"
                onBlur={onBlur}
                options={genders}
                errors={errors}
              />
            )}
          />
        )}
        <Controller
          name="partOfSpeech"
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <ComboBoxWrapper
              placeholder="Part of Speech"
              formField="partOfSpeech"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              options={partsOfSpeech}
              errors={errors}
            />
          )}
        />
        {watch().partOfSpeech === "preposition" && hasCases && (
          <Controller
            name="grammaticalCase"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <ComboBoxWrapper
                placeholder="Case after preposition"
                value={value ? value : ""}
                formField="grammaticalCase"
                onChange={onChange}
                onBlur={onBlur}
                options={cases}
                errors={errors}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
