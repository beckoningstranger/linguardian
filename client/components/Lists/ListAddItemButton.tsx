"use client";

import { ListAndUnitData, UserLanguagesWithFlags } from "@/lib/types";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddItemDialog from "../Dictionary/AddItemDialog";

interface ListAddItemButtonProps {
  userLanguagesWithFlags: UserLanguagesWithFlags;
  addToThisList: ListAndUnitData;
}

export default function ListAddItemButton({
  userLanguagesWithFlags,
  addToThisList,
}: ListAddItemButtonProps) {
  const [showAddNewItemDialog, setShowAddNewItemDialog] = useState(false);

  return (
    <button
      className="flex w-full flex-col items-center justify-center rounded-md bg-slate-100 p-1"
      onClick={() => {
        setShowAddNewItemDialog(true);
      }}
    >
      <div
        className={`m-1 grid h-12 w-12 place-items-center rounded-full border border-white bg-green-400`}
      >
        <FaPlus className="text-2xl font-semibold text-white" />
      </div>
      {showAddNewItemDialog && (
        <AddItemDialog
          isOpen={showAddNewItemDialog}
          setIsOpen={setShowAddNewItemDialog}
          seperatedUserLanguagesWithFlags={userLanguagesWithFlags}
          mode="addToList"
          listAndUnitData={addToThisList}
        />
      )}
    </button>
  );
}
