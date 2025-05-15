import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

import { changeListDetails } from "../actions";

export function useEditUnitName({
  unitName,
  unitOrder,
  listNumber,
}: {
  unitName: string;
  unitOrder: string[];
  listNumber: number;
}) {
  const [editMode, setEditMode] = useState(false);
  const [updatedUnitName, setUpdatedUnitName] = useState(unitName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    editUnitNameAction();
  };

  const editUnitNameAction = () => {
    const newUnitOrder = unitOrder.map((u) =>
      u === unitName ? updatedUnitName : u
    );

    if (newUnitOrder.join() !== unitOrder.join()) {
      toast.promise(
        changeListDetails({ listNumber, unitOrder: newUnitOrder }),
        {
          loading: "Changing unit name...",
          success: "Unit name updated!",
          error: (err) => err.toString(),
        }
      );
    }
  };

  return {
    editMode,
    setEditMode,
    updatedUnitName,
    setUpdatedUnitName,
    handleSubmit,
    editUnitNameAction,
  };
}
