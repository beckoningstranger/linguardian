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
      onClick={() => {
        setShowAddNewItemDialog(true);
      }}
      className="h-auto"
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
          mode="addToList"
          listAndUnitData={addToThisList}
        />
      )}
    </Button>
  );
}
