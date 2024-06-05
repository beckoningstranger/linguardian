import paths from "@/paths";
import { Item, SupportedLanguage } from "@/types";
import Link from "next/link";

interface ListUnitsProps {
  unitOrder: string[];
  units: { unitName: string; item: Item }[];
  listNumber: number;
  language: SupportedLanguage;
}

export default function ListUnits({
  unitOrder,
  units,
  listNumber,
  language,
}: ListUnitsProps) {
  const renderedUnits = unitOrder?.map((unitName, index) => {
    const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
      if (itemInUnit.unitName === unitName) a += 1;
      return a;
    }, 0);

    // IDEA: see how much the user has learned for each unit and calculate from- and to- values
    // for the gradient colors to visualize their progress
    return (
      <Link
        key={index}
        href={paths.unitDetailsPath(listNumber, index + 1, language)}
        className="flex w-full justify-center"
      >
        <div
          className={`${
            index % 2 === 0 &&
            "rounded-bl-[70px] rounded-tr-[70px] bg-gradient-to-tr"
          } ${
            index % 2 !== 0 &&
            "rounded-tl-[70px] rounded-br-[70px] bg-gradient-to-tl"
          } border border-slate-800 text-center py-6 shadow-lg hover:shadow-2xl w-11/12 flex justify-center bg-gradient-to-r from-slate-100 to-slate-100`}
        >
          {unitName}
        </div>
      </Link>
    );
  });

  return (
    <div id="units" className="my-2 flex flex-col items-center gap-y-2">
      {renderedUnits}
    </div>
  );
}
