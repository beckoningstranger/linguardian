"use client";

import {
  AddItemDialog,
  IconSidebarButton,
  TopContextMenuButton,
} from "@/components";
import { useUnitContext } from "@/context/UnitContext";
import { addItemToUnitAction } from "@/lib/actions/list-actions";
import { Item } from "@/lib/contracts";
import toast from "react-hot-toast";

interface AddItemsToUnitButtonProps {
  mode: "desktop" | "mobile";
}

export default function AddItemsToUnitButton({
  mode,
}: AddItemsToUnitButtonProps) {
  const {
    showAddItemDialog,
    setShowAddItemDialog,
    listNumber,
    unitNumber,
    listLanguage,
    unitName,
  } = useUnitContext();

  const handleClick = () => {
    setShowAddItemDialog(true);
  };

  let button;
  if (mode === "desktop")
    button = <IconSidebarButton mode="addItems" onClick={handleClick} />;

  if (mode === "mobile")
    button = <TopContextMenuButton onClick={handleClick} mode="addItems" />;

  const handleClickonSearchResult = (item: Item) => {
    toast.promise(
      addItemToUnitAction(listNumber, unitName, item.id, listLanguage.code),
      {
        loading: "Adding item...",
        success: (res) => res.message,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );
    setShowAddItemDialog(false);
  };

  return (
    <>
      {button}
      <AddItemDialog
        title={`Add item to ${unitName}`}
        isOpen={showAddItemDialog}
        setIsOpen={setShowAddItemDialog}
        handleClickonResult={handleClickonSearchResult}
        searchMode="searchResultWillBeAddedToList"
        listNumber={listNumber}
        unitName={unitName}
        unitNumber={unitNumber}
        searchLanguageCodes={[listLanguage.code]}
        listLanguageCode={listLanguage.code}
      />
    </>
  );
}
