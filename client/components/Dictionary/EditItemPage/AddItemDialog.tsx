"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

import { addItemToList } from "@/lib/actions";
import useUserOnClient from "@/lib/hooks/useUserOnClient";
import paths from "@/lib/paths";
import {
  ItemFE,
  ItemWithPopulatedTranslationsFE,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import Search from "../Search/Search";

interface AddItemDialogProps {
  mode: "addAsTranslation" | "addToList";
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  item?: ItemWithPopulatedTranslationsFE;
  itemLanguage?: SupportedLanguage;
  translations?: Partial<Record<SupportedLanguage, ItemFE[]>>;
  setTranslations?: Dispatch<
    SetStateAction<Partial<Record<SupportedLanguage, ItemFE[]>>>
  >;
  listAndUnitData?: ListAndUnitData;
}

export default function AddItemDialog({
  item,
  itemLanguage,
  isOpen,
  setIsOpen,
  translations,
  setTranslations,
  mode,
  listAndUnitData,
}: AddItemDialogProps) {
  const router = useRouter();
  const user = useUserOnClient();
  const allUserLanguagesWithFlags = user
    ? [user.native, user.learnedLanguages].flat()
    : [];

  const searchLanguages =
    listAndUnitData && mode === "addToList"
      ? [listAndUnitData.languageWithFlagAndName]
      : [...allUserLanguagesWithFlags];

  if (item && mode === "addAsTranslation")
    searchLanguages.splice(
      allUserLanguagesWithFlags.findIndex(
        (itemLanguageAndFlag) => itemLanguageAndFlag.code === itemLanguage
      ),
      1
    );

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-20 flex items-center justify-center">
        <Button className="absolute right-8 top-8">
          <XMarkIcon className="h-8 w-8" />
        </Button>
        <DialogPanel className="flex h-full max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-md border bg-white p-8">
          <DialogTitle className="text-2xl font-bold">
            {mode === "addAsTranslation"
              ? "Add translations"
              : `Add a new item to "${listAndUnitData?.listName}"`}
          </DialogTitle>
          <div className="grid gap-2 text-lg">
            <div>
              Let&apos;s first see if Linguardian&apos;s dictionary already
              contains the word you want to add.
            </div>
            <Search
              searchLanguages={searchLanguages}
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
              listData={listAndUnitData}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  async function addItemToThisList(item: ItemWithPopulatedTranslationsFE) {
    if (!listAndUnitData)
      throw new Error("Cannot add item, list data is missing...");
    toast.promise(addItemToList(listAndUnitData, item), {
      loading: "Adding item to this list...",
      success: (result) => {
        setIsOpen(false);
        if (result?.message === "Duplicate item") {
          return "Item is already in the list! ⚠️";
        }
        return `Item added! 🎉`;
      },
      error: (err) => {
        return `Failed to add item: ${err.message}`;
      },
    });
  }

  function addItemAsTranslation(item: ItemFE) {
    if (translations && setTranslations) {
      if (!translations[item.language]) translations[item.language] = [];
      const isAddingDuplicate = translations[item.language]?.some(
        (it) => it.slug === item.slug
      );
      if (!isAddingDuplicate) {
        translations[item.language]?.push(item);
        setTranslations(JSON.parse(JSON.stringify(translations)));
        toast.success("Translation added");
      } else {
        toast.error("Item already is a translation");
      }
      setIsOpen(false);
      if (listAndUnitData)
        router.push(
          paths.unitDetailsPath(
            listAndUnitData.listNumber,
            listAndUnitData.unitNumber
          )
        );
    }
  }
}
