import paths from "@/lib/paths";
import { Item, LearnedItem, SupportedLanguage } from "@/lib/types";
import Link from "next/link";

interface ListUnitsProps {
  unitOrder: string[];
  units: { unitName: string; item: Item }[];
  listNumber: number;
  language: SupportedLanguage;
  userIsAuthor: boolean;
  learnedItemsForListLanguage: LearnedItem[] | undefined;
}

export default function ListUnits({
  unitOrder,
  units,
  listNumber,
  language,
  userIsAuthor,
  learnedItemsForListLanguage,
}: ListUnitsProps) {
  const learnedIds = learnedItemsForListLanguage?.map((item) => item.id);

  const renderedUnits = unitOrder?.map((unitName, index) => {
    const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
      if (itemInUnit.unitName === unitName) a += 1;
      return a;
    }, 0);

    const itemsInUnit = units.filter((item) => item.unitName === unitName);

    const noOfLearnedItemsInUnit = itemsInUnit.filter((item) =>
      learnedIds?.includes(item.item._id)
    ).length;

    return (
      <Link
        key={index}
        href={paths.unitDetailsPath(listNumber, index + 1, language)}
        className="flex w-full justify-center"
      >
        <UnitButton
          label={unitName}
          percentage={(100 / noOfItemsInUnit) * noOfLearnedItemsInUnit}
        />
      </Link>
    );
  });

  return (
    <div id="units" className="my-2 flex flex-col items-center gap-y-2">
      {renderedUnits}

      {userIsAuthor && <UnitButton label="Add a new unit" percentage={0} />}
    </div>
  );
}

interface UnitButtonProps {
  label: string;
  percentage: number;
}

function UnitButton({ label, percentage }: UnitButtonProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const fillWidth = `${clampedPercentage}%`;

  return (
    <div
      className={`relative flex w-11/12 items-center justify-center rounded-lg border border-slate-800 py-2 text-center shadow-lg hover:shadow-2xl`}
    >
      <div
        className={`absolute inset-0 z-0 rounded-lg bg-green-300`}
        style={{
          width: fillWidth,
        }}
      />
      <button className={`relative z-10 rounded-lg px-4 py-2`}>{label}</button>
    </div>
  );
}
