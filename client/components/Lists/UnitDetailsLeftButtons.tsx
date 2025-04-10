"use client";

import IconSidebar from "@/components/IconSidebar/IconSidebar";
import Button from "@/components/ui/Button";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import DeleteUnitButton from "./DeleteUnitButton";
import IconSidebarButton from "../IconSidebar/IconSidebarButton";

interface UnitDetailsLeftButtonsProps {
  listNumber: number;
  unitName: string;
  unitNumber: number;
  noOfItemsInUnit: number;
  userIsAuthor: boolean;
}

export default function UnitDetailsLeftButtons({
  listNumber,
  unitName,
  unitNumber,
  noOfItemsInUnit,
  userIsAuthor,
}: UnitDetailsLeftButtonsProps) {
  return (
    <IconSidebar showOn="tablet" position="left">
      <IconSidebarButton type="back" link={paths.listDetailsPath(listNumber)} />
      {userIsAuthor && (
        <>
          <IconSidebarButton
            type="edit"
            label="Edit this unit"
            link={paths.editUnitPath(listNumber, unitNumber)}
          />
          <MobileMenuContextProvider>
            <DeleteUnitButton
              listNumber={listNumber}
              unitName={unitName}
              noOfItemsInUnit={noOfItemsInUnit}
              mode="desktop"
            />
          </MobileMenuContextProvider>
        </>
      )}
    </IconSidebar>
  );
}
