"use client";

import { UnitHeaderArrowButton, UnitNameInput } from "@/components";
import { useUnitContext } from "@/context/UnitContext";

interface EditUnitHeaderProps {}

export default function EditUnitHeader({}: EditUnitHeaderProps) {
  const context = useUnitContext();
  if (!context) throw new Error("Could not get unit context");
  const { unitName, listLanguage, listNumber } = context;

  return (
    <div className="flex w-full justify-between bg-white/90 text-center tablet:min-w-[620px] tablet:rounded-lg">
      <UnitHeaderArrowButton direction="left" location="editUnitPage" />
      <UnitNameInput
        unitName={unitName}
        listNumber={listNumber}
        languageCode={listLanguage.code}
      />
      <UnitHeaderArrowButton direction="right" location="editUnitPage" />
    </div>
  );
}
