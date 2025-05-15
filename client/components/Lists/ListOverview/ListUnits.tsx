import Link from "next/link";

import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { getUnitInformation } from "@/lib/helperFunctionsClient";
import { LearningDataForLanguage, PopulatedList } from "@/lib/types";
import UnitButton from "./UnitButton";
import paths from "@/lib/paths";

interface ListUnitsProps {
  listData: PopulatedList;
  learningDataForLanguage?: LearningDataForLanguage;
}

export default function ListUnits({
  listData,
  learningDataForLanguage,
}: ListUnitsProps) {
  const { listNumber, units, unitOrder } = listData;

  const learnedIds = learningDataForLanguage?.learnedItems?.map(
    (item) => item.id
  );

  return (
    <div className="tablet:col-span-2 desktopxl:row-start-2">
      <div className="my-2 flex w-full flex-col gap-y-2 tablet:m-0">
        {unitOrder?.map((unitName, index) => {
          const { noOfItemsInUnit, fillWidth } = getUnitInformation(
            units,
            unitName,
            learnedIds
          );

          return (
            <Link
              key={index}
              href={paths.unitDetailsPath(listNumber, index + 1)}
              className="flex w-full justify-center"
            >
              <MobileMenuContextProvider>
                <UnitButton
                  fillWidth={fillWidth}
                  unitName={unitName}
                  noOfItemsInUnit={noOfItemsInUnit}
                />
              </MobileMenuContextProvider>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
