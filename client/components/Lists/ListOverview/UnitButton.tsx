"use client";

import { useListContext } from "@/context/ListContext";
import { changeListDetails } from "@/lib/actions";
import { cn } from "@/lib/helperFunctionsClient";
import { useOutsideClick } from "@/lib/hooks";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import DeleteUnitButton from "../DeleteUnitButton";

interface UnitButtonProps {
  learnedItemsPercentage: number;
  unitName: string;
  noOfItemsInUnit: number;
  unitOrder: string[];
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
}

export default function UnitButton({
  learnedItemsPercentage,
  unitName,
  noOfItemsInUnit,
  unitOrder,
  setUnitOrder,
}: UnitButtonProps) {
  const {
    listData: { listNumber },
    userIsAuthor,
  } = useListContext();
  const [editMode, setEditMode] = useState(false);
  const [updatedUnitName, setUpdatedUnitName] = useState(unitName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    editUnitNameAction();
  };

  const inputRef = useOutsideClick(() => {
    setEditMode(false);
    if (updatedUnitName !== unitName) editUnitNameAction();
  });

  useEffect(() => {
    if (editMode && inputRef) inputRef.current?.focus();
  }, [inputRef, editMode]);

  const clampedLearnedItemsPercentage = Math.max(
    0,
    Math.min(100, learnedItemsPercentage)
  );
  const fillWidth = `${clampedLearnedItemsPercentage}%`;

  const editUnitNameAction = () => {
    let newUnitOrder = unitOrder.reduce((a, curr) => {
      if (curr === unitName) {
        a.push(updatedUnitName);
      } else {
        a.push(curr);
      }
      return a;
    }, [] as string[]);

    if (newUnitOrder !== unitOrder && userIsAuthor)
      toast.promise(
        changeListDetails({ listNumber: listNumber, unitOrder: newUnitOrder }),
        {
          loading: "Changing unit name...",
          success: () => "Unit name updated! ✅",
          error: (err) => err.toString(),
        }
      );
  };

  return (
    <div
      className={cn(
        `relative flex h-[90px] w-full items-center rounded-lg bg-white/90 text-center text-cmdb shadow-lg transition-colors duration-300 hover:bg-white tablet:text-clgb`,
        userIsAuthor && "cursor-grab"
      )}
    >
      <div
        className={cn(
          "z-10 flex flex-col w-full rounded-lg",
          userIsAuthor && "cursor-grab active:cursor-grabbing"
        )}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (userIsAuthor) setEditMode(true);
          }}
          className="mx-auto cursor-pointer"
        >
          {!editMode && <div>{unitName}</div>}
          {!editMode && (
            <div className="text-center text-csmr">
              ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
            </div>
          )}
        </div>
        {editMode && (
          <form onSubmit={handleSubmit}>
            <label htmlFor={unitName} className="sr-only">
              {unitName} - Click to edit
            </label>
            <input
              type="text"
              id={unitName}
              value={updatedUnitName}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={(e) => {
                setUpdatedUnitName(e.target.value);
              }}
            />
          </form>
        )}
      </div>
      <div
        style={{
          width: fillWidth,
        }}
        className="absolute bottom-0 left-0 h-2 w-full rounded-b-lg bg-green-300"
      />
      {userIsAuthor && (
        <DeleteUnitButton
          setUnitOrder={setUnitOrder}
          unitName={unitName}
          listNumber={listNumber}
          noOfItemsInUnit={noOfItemsInUnit}
        />
      )}
    </div>
  );
}
