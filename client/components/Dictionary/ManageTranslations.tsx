"use client";

import { Item, SupportedLanguage } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldError, Merge } from "react-hook-form";
import FormErrors from "./FormErrors";
import Flag from "react-world-flags";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "@headlessui/react";
import { Types } from "mongoose";

interface ManageTranslationsProps {
  setValue: Function;
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  allTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
  visibleTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined;
}

export default function ManageTranslations({
  setValue,
  errors,
  allTranslations,
  visibleTranslations,
}: ManageTranslationsProps) {
  const label = { singular: "Translation", plural: "Translations" };
  const [translationsArray, setTranslationsArray] = useState(
    visibleTranslations || {}
  );

  console.log("all", allTranslations);
  useEffect(() => {
    const updatedTranslations = getupdatedTranslations(
      translationsArray,
      allTranslations
    );
    if (JSON.stringify(updatedTranslations) !== JSON.stringify(allTranslations))
      setValue("translations", updatedTranslations, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
  }, [translationsArray, setValue, allTranslations]);

  const renderedTranslations = Object.values(translationsArray).map((x) =>
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
              translationsArray,
              translation._id,
              setTranslationsArray
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
            console.log("Add new translations");
          }}
        >
          <p className="flex h-full items-center font-semibold capitalize">
            {Object.values(translationsArray).flat().length > 1 ? (
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
    </>
  );
}

function removeTranslationById(
  visibleTranslations: Partial<Record<SupportedLanguage, Item[]>>,
  idToRemove: Types.ObjectId,
  setTranslationsArray: Dispatch<
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
  setTranslationsArray(updatedTranslations);
}

function getupdatedTranslations(
  translationsArray: Partial<Record<SupportedLanguage, Item[]>>,
  allTranslations: Partial<Record<SupportedLanguage, Item[]>> | undefined
) {
  if (!allTranslations) return translationsArray;
  const languagesInTranslationArray = Object.keys(translationsArray);
  const languagesUserHasNotTouched = Object.keys(allTranslations).filter(
    (language) => !languagesInTranslationArray.includes(language)
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
    ...translationsArray,
  };
}

// See that users can ADD translations. This will probably be handled best if a modal opens
// after clicking the plus icon. In the modal, users will be able to search for translations.
// Clicking a translation will add it to the array.
