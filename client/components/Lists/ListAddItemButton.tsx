"use client";

import { ListAndUnitData } from "@/lib/types";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddItemDialog from "../Dictionary/AddItemDialog";
import Button from "../ui/Button";

interface ListAddItemButtonProps {
  addToThisList: ListAndUnitData;
}

export default function ListAddItemButton({
  addToThisList,
}: ListAddItemButtonProps) {
  const [showAddNewItemDialog, setShowAddNewItemDialog] = useState(false);

  return (
    <Button
      color="blue"
      fullWidth
      intent="icon"
      rounded
      noRing
      onClick={() => {
        setShowAddNewItemDialog(true);
      }}
      className="min-h-[86px]"
    >
      <div
        className={`m-1 grid h-16 w-16 place-items-center rounded-full bg-green-400`}
      >
        <FaPlus className="text-2xl font-semibold text-white" />
      </div>
      {showAddNewItemDialog && (
        <AddItemDialog
          isOpen={showAddNewItemDialog}
          setIsOpen={setShowAddNewItemDialog}
          mode="addToList"
          listAndUnitData={addToThisList}
        />
      )}
    </Button>
  );
}
