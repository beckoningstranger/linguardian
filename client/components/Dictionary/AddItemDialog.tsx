"use client";

import { addItemToList } from "@/lib/actions";
import {
  DictionarySearchResult,
  Item,
  ItemWithPopulatedTranslations,
  ListAndUnitData,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";
import Search from "./Search";

interface AddItemDialogProps {
  mode: "addAsTranslation" | "addToList";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  seperatedUserLanguagesWithFlags: UserLanguagesWithFlags;
  item?: ItemWithPopulatedTranslations;
  itemLanguage?: SupportedLanguage;
  translations?: Partial<Record<SupportedLanguage, Item[]>>;
  setTranslations?: Dispatch<
    SetStateAction<Partial<Record<SupportedLanguage, Item[]>>>
  >;
  addToThisList?: ListAndUnitData;
}

export default function AddItemDialog({
  item,
  itemLanguage,
  isOpen,
  setIsOpen,
  seperatedUserLanguagesWithFlags,
  translations,
  setTranslations,
  mode,
  addToThisList,
}: AddItemDialogProps) {
  console.log("ADdItemDialog MODE", mode);
  const allUserLanguagesWithFlags = Object.values(
    seperatedUserLanguagesWithFlags
  ).flat();

  const searchLanguagesWithFlags =
    addToThisList && mode === "addToList"
      ? [addToThisList.languageWithFlag]
      : [...allUserLanguagesWithFlags];

  if (item && mode === "addAsTranslation")
    searchLanguagesWithFlags.splice(
      allUserLanguagesWithFlags.findIndex(
        (itemLanguageAndFlag) => itemLanguageAndFlag.name === itemLanguage
      ),
      1
    );

  let addItemToThisList: any;
  if (addToThisList)
    addItemToThisList = addItemToList.bind(null, addToThisList);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Button className="absolute right-8 top-8">
          <XMarkIcon className="h-8 w-8" />
        </Button>
        <DialogPanel className="flex h-full max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-md border bg-white p-8">
          <DialogTitle className="text-2xl font-bold">
            {mode === "addAsTranslation"
              ? "Add translations"
              : `Add a new item to "${addToThisList?.listName}"`}
          </DialogTitle>
          <div className="grid gap-2 text-lg">
            <div>
              Let&apos;s first see if Linguardian&apos;s dictionary already
              contains the word you want to add.
            </div>
            <Search
              searchLanguagesWithFlags={searchLanguagesWithFlags}
              mode={
                mode === "addAsTranslation"
                  ? "searchResultIsTranslation"
                  : "searchResultWillBeAddedToList"
              }
              doAfterClickOnSearchResult={
                mode === "addAsTranslation"
                  ? addItemAsTranslation
                  : addItemToThisList
              }
              listData={addToThisList}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  function addItemAsTranslation(item: DictionarySearchResult) {
    if (translations && setTranslations) {
      if (!translations[item.language]) translations[item.language] = [];
      translations[item.language]?.push(item);
      setTranslations(JSON.parse(JSON.stringify(translations)));
      setIsOpen(false);
    }
  }
}
