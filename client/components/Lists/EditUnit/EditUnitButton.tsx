"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { useListContext } from "@/context/ListContext";
import { useEditUnitName } from "@/lib/hooks/useEditUnitName";
import DeleteUnitButton from "../EditList/DeleteUnitButton";
import EditUnitNameForm from "./EditUnitNameForm";

interface EditUnitButtonProps {
  unitName: string;
  noOfItemsInUnit: number;
  unitOrder: string[];
  setUnitOrder: Dispatch<SetStateAction<string[]>>;
  linkPath: string;
}

export default function EditUnitButton({
  unitName,
  noOfItemsInUnit,
  unitOrder,
  setUnitOrder,
  linkPath,
}: EditUnitButtonProps) {
  const {
    listData: { listNumber },
  } = useListContext();

  const {
    editMode,
    setEditMode,
    updatedUnitName,
    setUpdatedUnitName,
    handleSubmit,
    editUnitNameAction,
  } = useEditUnitName({ unitName, unitOrder, listNumber });

  return (
    <div className="relative flex h-[90px] w-full items-center rounded-lg bg-white/90 px-20 text-center text-cmdb shadow-lg transition-colors duration-300 hover:bg-white tablet:text-clgb">
      <Link
        className="flex size-full cursor-grab flex-col justify-center active:cursor-grabbing"
        href={linkPath}
      >
        {!editMode && (
          <>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditMode(true);
              }}
              className="cursor-pointer"
            >
              {unitName}
            </div>
            <div className="text-csmr">
              ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
            </div>
          </>
        )}
        {editMode && (
          <EditUnitNameForm
            handleSubmit={handleSubmit}
            unitName={unitName}
            updatedUnitName={updatedUnitName}
            setUpdatedUnitName={setUpdatedUnitName}
            editMode={editMode}
            setEditMode={setEditMode}
            editUnitNameAction={editUnitNameAction}
          />
        )}
      </Link>

      <div className="absolute right-0 z-10 flex h-full w-[80px] cursor-pointer items-center justify-center rounded-r-lg text-red-500 hover:bg-red-500 hover:text-white">
        <DeleteUnitButton
          setUnitOrder={setUnitOrder}
          unitName={unitName}
          listNumber={listNumber}
          noOfItemsInUnit={noOfItemsInUnit}
          mode="inCard"
        />
      </div>
    </div>
  );
}
