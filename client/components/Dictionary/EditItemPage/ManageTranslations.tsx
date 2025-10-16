"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import Flag from "react-world-flags";

import { AddItemDialog, FormErrors, MinusIcon } from "@/components";
import { useUser } from "@/context/UserContext";
import {
  Item,
  ItemWithPopulatedTranslations,
  PopulatedTranslations,
  SupportedLanguage,
} from "@/lib/contracts";
import toast from "react-hot-toast";

interface ManageTranslationsProps {
  item: ItemWithPopulatedTranslations;
}

export default function ManageTranslations({ item }: ManageTranslationsProps) {
  const label = { singular: "Translation", plural: "Translations" };
  const [showAddTranslationDialog, setShowAddTranslationDialog] =
    useState(false);

  const { user } = useUser();
  if (!user) throw new Error("User not found");
  const allUserLanguageCodes = [user.native, ...user.learnedLanguages].map(
    (lang) => lang.code
  );

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<ItemWithPopulatedTranslations>();

  const { field } = useController({
    name: "translations",
    control,
  });

  const allLanguagesCodesExceptItemLanguage = allUserLanguageCodes.filter(
    (lang) => lang !== watch("language")
  );

  const translations = field.value || {};
  const setTranslations = field.onChange;

  const visibleTranslations = Object.fromEntries(
    Object.entries(translations).filter(([code]) =>
      allUserLanguageCodes.includes(code as SupportedLanguage)
    )
  );

  const renderedTranslations = Object.values(visibleTranslations).map(
    (language) =>
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

          <MinusIcon onClick={() => removeTranslationById(translation.id)} />
        </div>
      ))
  );

  function removeTranslationById(idToRemove: string) {
    const updated: PopulatedTranslations = { ...translations };

    Object.entries(translations).forEach(([lang, items]) => {
      updated[lang as SupportedLanguage] = items.filter(
        (item) => item.id !== idToRemove
      );
    });

    setTranslations(updated);
  }

  function addItemAsTranslation(item: Item) {
    const translations = field.value || {};

    const currentItems = translations[item.language] || [];

    if (currentItems.some((it) => it.slug === item.slug)) {
      toast.error("Item already is a translation");
      setShowAddTranslationDialog(false);
      return;
    }

    const updatedTranslations = {
      ...translations,
      /* Since search results don't come with populated translations but zod expects
      them, we just set an empty translation field here. This is not a problem because 
      the backend does not need the translation property anyway. */
      [item.language]: [...currentItems, { ...item, translations: {} }],
    };
    setTranslations(updatedTranslations);

    toast.success("Translation added");
    setShowAddTranslationDialog(false);
  }

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
      <AddItemDialog
        title="Add translations"
        isOpen={showAddTranslationDialog}
        setIsOpen={setShowAddTranslationDialog}
        searchMode="searchResultIsTranslation"
        handleClickonResult={addItemAsTranslation}
        searchLanguageCodes={allLanguagesCodesExceptItemLanguage}
      />
      <FormErrors field="translations" errors={errors} />
    </div>
  );
}
