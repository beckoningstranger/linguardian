"use client";

import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import paths from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/components";
import { useUnitContext } from "@/context/UnitContext";

interface UnitHeaderArrowButtonProps {
  direction: "left" | "right";
  location: "editUnitPage" | "unitOverview";
}
export default function UnitHeaderArrowButton({
  direction,
  location,
}: UnitHeaderArrowButtonProps) {
  const { listNumber, unitOrder, unitNumber } = useUnitContext();
  const totalUnits = unitOrder.length;

  const disabled =
    direction === "left" ? unitNumber < 2 : unitNumber > totalUnits - 1;

  return (
    <Link
      href={
        location === "editUnitPage"
          ? paths.editUnitPath(
              listNumber,
              direction === "left" ? unitNumber - 1 : unitNumber + 1
            )
          : paths.unitDetailsPath(
              listNumber,
              direction === "left" ? unitNumber - 1 : unitNumber + 1
            )
      }
      aria-disabled={disabled}
      className={cn(
        "size-[80px] rounded-lg overflow-hidden hover:bg-white hover:drop-shadow-md",
        disabled && "cursor-not-allowed pointer-events-none"
      )}
    >
      <Button
        disabled={disabled}
        noRing
        color="transparent"
        intent="icon"
        className={cn("size-full rounded-l-lg disabled:bg-transparent")}
      >
        {direction === "left" ? (
          <FaArrowLeft className="size-10" />
        ) : (
          <FaArrowRight className="size-10" />
        )}
      </Button>
    </Link>
  );
}
