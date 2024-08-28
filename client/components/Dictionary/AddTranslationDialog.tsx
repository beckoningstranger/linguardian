import {
  DictionarySearchResult,
  Item,
  ItemWithPopulatedTranslations,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";
import Search from "./Search";

interface AddTranslationDialogProps {
  item: ItemWithPopulatedTranslations;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userLanguagesWithFlags: UserLanguagesWithFlags;
  translations: Partial<Record<SupportedLanguage, Item[]>>;
  setTranslations: Dispatch<
    SetStateAction<Partial<Record<SupportedLanguage, Item[]>>>
  >;
}

export default function AddTranslationDialog({
  item,
  isOpen,
  setIsOpen,
  userLanguagesWithFlags,
  translations,
  setTranslations,
}: AddTranslationDialogProps) {
  const allUserLanguagesWithFlags = Object.values(
    userLanguagesWithFlags
  ).flat();

  const searchLanguagesWithFlags = [...allUserLanguagesWithFlags];

  searchLanguagesWithFlags.splice(
    allUserLanguagesWithFlags.findIndex(
      (itemLanguageAndFlag) => itemLanguageAndFlag.name === item.language
    ),
    1
  );

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Button className="absolute right-6 top-6">
          <XMarkIcon className="h-6 w-6" />
        </Button>
        <DialogPanel className="flex h-full max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-2 rounded-md border bg-white p-8">
          <DialogTitle className="font-bold">Add translations</DialogTitle>
          <div className="grid gap-2">
            <div>
              First, let&apos;s see if Linguardian&apos;s dictionary already
              contains the word you want to add.
            </div>
            <Search
              searchLanguagesWithFlags={searchLanguagesWithFlags}
              mode="returnItem"
              addTranslation={addTranslation}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  function addTranslation(translation: DictionarySearchResult) {
    translations[translation.language]?.push(translation);
    setTranslations(JSON.parse(JSON.stringify(translations)));
    setIsOpen(false);
  }
}
