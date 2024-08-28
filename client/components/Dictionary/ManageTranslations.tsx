"use client";

import {
  Item,
  ItemWithPopulatedTranslations,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { Button } from "@headlessui/react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { Types } from "mongoose";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import Flag from "react-world-flags";
import AddTranslationDialog from "./AddTranslationDialog";
import FormErrors from "./FormErrors";

interface ManageTranslationsProps {
  item: ItemWithPopulatedTranslations;
  setValue: Function;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  allTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
  visibleTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
  userLanguagesWithFlags: UserLanguagesWithFlags;
}

export default function ManageTranslations({
  item,
  setValue,
  errors,
  allTranslations,
  visibleTranslations,
  userLanguagesWithFlags,
}: ManageTranslationsProps) {
  const label = { singular: "Translation", plural: "Translations" };
  const [translations, setTranslations] = useState(visibleTranslations || {});
  const [showAddTranslationDialog, setShowAddTranslationDialog] =
    useState(false);

  useEffect(() => {
    const touchedTranslations = getTouchedTranslations(
      translations,
      allTranslations,
      userLanguagesWithFlags.isLearning.map((lang) => lang.name)
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
    userLanguagesWithFlags.isLearning,
  ]);

  const renderedTranslations = Object.values(translations).map((x) =>
    x.map((translation) => (
      <div
        key={translation.slug}
        className="flex items-center justify-center gap-2 rounded-md border py-2 pl-3 shadow-md"
      >
        <Flag
          code={translation.language}
          className="h-6 w-6 rounded-full object-cover"
        />
        <span>{translation.name}</span>
        <span
          className="flex h-6 w-6 items-center justify-center"
          onClick={() =>
            removeTranslationById(
              translations,
              translation._id,
              setTranslations
            )
          }
        >
          <MinusCircleIcon className="h-5 w-5 text-red-500" />
        </span>
      </div>
    ))
  );

  return (
    <>
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
      <FormErrors errors={errors} />
      <AddTranslationDialog
        item={item}
        isOpen={showAddTranslationDialog}
        setIsOpen={setShowAddTranslationDialog}
        userLanguagesWithFlags={userLanguagesWithFlags}
        translations={translations}
        setTranslations={setTranslations}
      />
    </>
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
