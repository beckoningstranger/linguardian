"use client";

import {
  Item,
  ItemWithPopulatedTranslations,
  SeperatedUserLanguages,
  SupportedLanguage,
} from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Types } from "mongoose";
import { FieldErrors, FieldValues } from "react-hook-form";
import Flag from "react-world-flags";
import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import { FormErrors } from "../../ui/FormErrors";
import AddItemDialog from "./AddItemDialog";
import MinusIcon from "./MinusIcon";

interface ManageTranslationsProps {
  item: Omit<ItemWithPopulatedTranslations, "_id">;
  itemLanguage: SupportedLanguage;
  setValue: Function;
  errors: FieldErrors<FieldValues>;
  allTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
  visibleTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
  seperatedUserLanguages: SeperatedUserLanguages;
}

export default function ManageTranslations({
  item,
  itemLanguage,
  setValue,
  errors,
  allTranslations,
  visibleTranslations,
  seperatedUserLanguages,
}: ManageTranslationsProps) {
  const label = { singular: "Translation", plural: "Translations" };
  const [translations, setTranslations] = useState(visibleTranslations || {});
  const [showAddTranslationDialog, setShowAddTranslationDialog] =
    useState(false);

  useEffect(() => {
    const touchedTranslations = getTouchedTranslations(
      translations,
      allTranslations,
      seperatedUserLanguages.learnedLanguages.map((lang) => lang.code)
    );
    if (JSON.stringify(touchedTranslations) !== JSON.stringify(allTranslations))
      setValue("translations", touchedTranslations, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
  }, [
    translations,
    setValue,
    allTranslations,
    seperatedUserLanguages.learnedLanguages,
  ]);

  const renderedTranslations = Object.values(translations).map((language) =>
    language.map((translation) => (
      <div
        key={translation.slug}
        className="relative flex w-[200px] items-center gap-2 rounded-md border bg-white py-2 pl-3 shadow-md"
      >
        <Flag
          code={translation.language}
          className="h-6 w-6 rounded-full object-cover"
        />
        <span>{translation.name}</span>

        <MinusIcon
          onClick={() =>
            removeTranslationById(
              translations,
              translation._id,
              setTranslations
            )
          }
        />
      </div>
    ))
  );

  return (
    <div id="translations">
      <div className="flex flex-col gap-2 text-sm">
        <Button
          className="flex w-32 items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            setShowAddTranslationDialog(true);
          }}
        >
          <p className="flex h-full items-center font-semibold capitalize">
            {Object.values(translations).flat().length > 1 ? (
              <span>{label.plural}</span>
            ) : (
              <span>{label.singular}</span>
            )}
          </p>
          <PlusCircleIcon className="flex h-full w-5 items-center text-green-400" />
        </Button>
        <div className="flex flex-wrap gap-2">{renderedTranslations}</div>
      </div>
      <FormErrors field="translations" errors={errors} />
      <AddItemDialog
        item={item}
        itemLanguage={itemLanguage}
        isOpen={showAddTranslationDialog}
        setIsOpen={setShowAddTranslationDialog}
        translations={translations}
        setTranslations={setTranslations}
        mode="addAsTranslation"
      />
    </div>
  );
}

function removeTranslationById(
  visibleTranslations: Partial<Record<SupportedLanguage, Item[]>>,
  idToRemove: Types.ObjectId,
  setTranslations: Dispatch<
    SetStateAction<Partial<Record<SupportedLanguage, Item[]>>>
  >
) {
  const updatedTranslations: Partial<Record<SupportedLanguage, Item[]>> = {};

  Object.keys(visibleTranslations).forEach((language) => {
    const key = language as SupportedLanguage;
    const itemArray = visibleTranslations[key];
    if (Array.isArray(itemArray)) {
      updatedTranslations[key] = itemArray.filter(
        (item) => item._id !== idToRemove
      );
    } else {
      updatedTranslations[key] = itemArray;
    }
  });
  setTranslations(updatedTranslations);
}

function getTouchedTranslations(
  translations: Partial<Record<SupportedLanguage, Item[]>>,
  allTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined,
  languagesUserIsLearning: SupportedLanguage[]
) {
  if (!allTranslations) return translations;
  const languagesUserHasNotTouched = Object.keys(allTranslations).filter(
    (language) =>
      !languagesUserIsLearning.includes(language as SupportedLanguage)
  );

  const translationsUserHasNotTouched: Partial<
    Record<SupportedLanguage, Item[]>
  > = {};
  languagesUserHasNotTouched.forEach(
    (lang) =>
      (translationsUserHasNotTouched[lang as SupportedLanguage] =
        allTranslations[lang as SupportedLanguage])
  );

  return {
    ...translationsUserHasNotTouched,
    ...translations,
  };
}
