import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

import { siteSettings } from "@/lib/siteSettings";
import {
  ItemWithPopulatedTranslationsFE,
  SupportedLanguage,
} from "@/lib/types";
import ComboBoxWrapper from "./ComboBoxWrapper";

interface EditPartOfSpeechGenderAndCaseProps {
  control: Control<
    ItemWithPopulatedTranslationsFE,
    any,
    ItemWithPopulatedTranslationsFE
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
  const { partsOfSpeech, hasGender, hasCases } =
    siteSettings.languageFeatures.find(
      (lang) => lang.langCode === itemLanguage
    )!;
  return (
    <div id="partOfSpeech">
      <div className="text-csmb font-semibold">Part of Speech</div>
      <div className="flex flex-col gap-2 phone:flex-row">
        {watch().partOfSpeech === "noun" && hasGender.length > 0 && (
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
                options={hasGender}
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
        {watch().partOfSpeech === "preposition" && hasCases.length > 0 && (
          <Controller
            name="case"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <ComboBoxWrapper
                placeholder="Case after preposition"
                value={value ? value : ""}
                formField="case"
                onChange={onChange}
                onBlur={onBlur}
                options={hasCases}
                errors={errors}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
