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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import paths from "@/lib/paths";

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
  listAndUnitData?: ListAndUnitData;
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
  listAndUnitData,
}: AddItemDialogProps) {
  const router = useRouter();
  const allUserLanguagesWithFlags = Object.values(
    seperatedUserLanguagesWithFlags
  ).flat();

  const searchLanguagesWithFlags =
    listAndUnitData && mode === "addToList"
      ? [listAndUnitData.languageWithFlag]
      : [...allUserLanguagesWithFlags];

  if (item && mode === "addAsTranslation")
    searchLanguagesWithFlags.splice(
      allUserLanguagesWithFlags.findIndex(
        (itemLanguageAndFlag) => itemLanguageAndFlag.name === itemLanguage
      ),
      1
    );

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
              : `Add a new item to "${listAndUnitData?.listName}"`}
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
              listData={listAndUnitData}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  async function addItemToThisList(item: ItemWithPopulatedTranslations) {
    if (!listAndUnitData)
      throw new Error("Cannot add item, list data is missing...");
    toast.promise(
      addItemToList(listAndUnitData, item), // Your fetch function
      {
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
      }
    );
  }

  function addItemAsTranslation(item: DictionarySearchResult) {
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
            listAndUnitData.unitNumber,
            listAndUnitData.languageWithFlag.name
          )
        );
    }
  }
}
