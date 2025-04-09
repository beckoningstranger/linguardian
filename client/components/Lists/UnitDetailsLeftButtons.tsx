"use client";

import IconSidebar from "@/components/IconSidebar/IconSidebar";
import Button from "@/components/ui/Button";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import DeleteUnitButton from "./DeleteUnitButton";

interface UnitDetailsLeftButtonsProps {
  listNumber: number;
  unitName: string;
  noOfItemsInUnit: number;
}

export default function UnitDetailsLeftButtons({
  listNumber,
  unitName,
  noOfItemsInUnit,
}: UnitDetailsLeftButtonsProps) {
  return (
    <IconSidebar showOn="tablet" position="left">
      <Link href={paths.listDetailsPath(listNumber)}>
        <Button
          intent="icon"
          color="white"
          noRing
          className="shadow-xl"
          rounded
        >
          <Image
            src={"/icons/ArrowLeft.svg"}
            height={72}
            width={72}
            alt="Back to List Overview Icon"
          />
        </Button>
      </Link>
      <div>
        <Button
          intent="icon"
          color="white"
          noRing
          className="shadow-xl"
          rounded
        >
          <Image
            src={"/icons/Pen.svg"}
            height={72}
            width={72}
            alt="Pen Icon to Edit"
          />
          {/* <TbPencil className="h-12 w-12 text-grey-800" /> */}
        </Button>
      </div>
      <DeleteUnitButton
        listNumber={listNumber}
        unitName={unitName}
        noOfItemsInUnit={noOfItemsInUnit}
        mode="standalone"
      />
      <MobileMenuContextProvider></MobileMenuContextProvider>
    </IconSidebar>
  );
}
