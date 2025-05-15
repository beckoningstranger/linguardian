"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/helperFunctionsClient";
import { useEditUnitName } from "@/lib/hooks/useEditUnitName";
import paths from "@/lib/paths";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import EditUnitNameForm from "../EditUnit/EditUnitNameForm";

interface EditUnitHeaderProps {
  unitName?: string;
  unitNumber: number;
  itemNumber: number;
  listNumber: number;
  unitOrder: string[];
}

export default function EditUnitHeader({
  unitName = "New Unit",
  unitNumber,
  itemNumber,
  listNumber,
  unitOrder,
}: EditUnitHeaderProps) {
  const unitCount = unitOrder.length;

  const {
    editMode,
    setEditMode,
    updatedUnitName,
    setUpdatedUnitName,
    handleSubmit,
    editUnitNameAction,
  } = useEditUnitName({ unitName, unitOrder, listNumber });

  return (
    <div className="flex w-full justify-between bg-white/90 text-center tablet:min-w-[620px] tablet:rounded-lg">
      <Link
        href={paths.unitDetailsPath(listNumber, unitNumber - 1)}
        aria-disabled={unitNumber < 2}
        className={cn(
          "h-[88px] w-[88px]",
          unitNumber < 2 && "cursor-not-allowed pointer-events-none"
        )}
      >
        <Button
          disabled={unitNumber < 2}
          noRing
          color="transparent"
          intent="icon"
          className={cn("h-full w-full")}
        >
          <FaArrowLeft className="h-11 w-11" />
        </Button>
      </Link>
      {!editMode && (
        <div className="flex select-none flex-col justify-center">
          <div
            className="cursor-pointer text-cxlb"
            onClick={() => setEditMode(true)}
          >
            {unitName}
          </div>
          <div className="text-cmdr">({itemNumber} items)</div>
        </div>
      )}
      {editMode && (
        <div className="flex items-center text-cxlb">
          <EditUnitNameForm
            handleSubmit={handleSubmit}
            unitName={unitName}
            updatedUnitName={updatedUnitName}
            editMode={editMode}
            setEditMode={setEditMode}
            setUpdatedUnitName={setUpdatedUnitName}
            editUnitNameAction={editUnitNameAction}
          />
        </div>
      )}
      <Link
        href={paths.unitDetailsPath(listNumber, unitNumber + 1)}
        aria-disabled={unitNumber > unitCount - 1}
        className={cn(
          "h-[88px] w-[88px]",
          unitNumber > unitCount - 1 && "cursor-not-allowed pointer-events-none"
        )}
      >
        <Button
          className="h-full w-full"
          intent="icon"
          noRing
          disabled={unitNumber > unitCount - 1}
        >
          <FaArrowRight className="h-11 w-11" />
        </Button>
      </Link>
    </div>
  );
}
