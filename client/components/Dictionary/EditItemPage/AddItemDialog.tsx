"use client";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction } from "react";

import Search from "@/components/Dictionary/Search/Search";
import { Item, SupportedLanguage } from "@/lib/contracts";
import { SearchMode } from "@/lib/types";

interface AddItemDialogProps {
  title: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleClickonResult: (item: Item) => void;
  searchMode: SearchMode;
  searchLanguageCodes: SupportedLanguage[];
  listNumber?: number;
  unitName?: string;
  unitNumber?: number;
  listLanguageCode?: SupportedLanguage;
}

export default function AddItemDialog({
  title,
  isOpen,
  setIsOpen,
  handleClickonResult,
  searchMode,
  searchLanguageCodes,
  listNumber,
  unitNumber,
  unitName,
  listLanguageCode,
}: AddItemDialogProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-20 flex items-center justify-center">
        <Button className="absolute right-8 top-8">
          <XMarkIcon className="h-8 w-8" />
        </Button>
        <DialogPanel className="flex h-full max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-md border bg-white p-8">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <div className="grid gap-2 text-lg">
            <div>
              Let&apos;s first see if Linguardian&apos;s dictionary already
              contains the word you want to add.
            </div>
            <Search
              mode={searchMode}
              doAfterClickOnSearchResult={handleClickonResult}
              searchLanguageCodes={searchLanguageCodes}
              listNumber={listNumber}
              unitName={unitName}
              unitNumber={unitNumber}
              listLanguageCode={listLanguageCode}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
