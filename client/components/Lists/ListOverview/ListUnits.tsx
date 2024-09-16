import paths from "@/lib/paths";
import { Item, LearnedItem, SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import UnitButton from "./UnitButton";
import NewUnitButton from "./NewUnitButton";
import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";

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
  const unitNames = units.reduce((a, curr) => {
    if (!a.includes(curr.unitName)) a.push(curr.unitName);
    return a;
  }, [] as string[]);

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
        <MobileMenuContextProvider>
          <UnitButton
            percentage={
              noOfItemsInUnit === 0
                ? 0
                : (100 / noOfItemsInUnit) * noOfLearnedItemsInUnit
            }
            userIsAuthor={userIsAuthor}
            unitName={unitName}
            listNumber={listNumber}
            noOfItemsInUnit={noOfItemsInUnit}
            unitOrder={unitNames}
          />
        </MobileMenuContextProvider>
      </Link>
    );
  });

  return (
    <div id="units" className="my-2 flex flex-col items-center gap-y-2">
      {renderedUnits}

      {userIsAuthor && (
        <NewUnitButton listNumber={listNumber} unitNames={unitNames} />
      )}
    </div>
  );
}
