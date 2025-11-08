"use client";

import { DeleteUnitButtonList, UnitNameInput } from "@/components";
import { useListContext } from "@/context/ListContext";

interface EditUnitButtonProps {
  unitName: string;
  noOfItemsInUnit: number;
}

export default function EditUnitButton({
  unitName,
  noOfItemsInUnit,
}: EditUnitButtonProps) {
  const { listNumber, listLanguage, unitOrder, setUnitOrder } =
    useListContext();

  return (
    <div className="relative flex h-[100px] w-full items-center rounded-lg bg-white/90 text-center text-cmdb shadow-lg transition-colors duration-300 hover:bg-white tablet:text-clgb">
      <UnitNameInput
        unitName={unitName}
        listNumber={listNumber}
        languageCode={listLanguage.code}
        unitOrder={unitOrder}
        setUnitOrder={setUnitOrder}
      />

      <div className="flex h-full w-[80px] items-center justify-center rounded-r-lg text-red-500 hover:bg-red-500 hover:text-white">
        <DeleteUnitButtonList
          unitName={unitName}
          noOfItemsInUnit={noOfItemsInUnit}
        />
      </div>
    </div>
  );
}
