import Link from "next/link";

import UnitButton from "@/components/Lists/ListOverview/UnitButton";
import { UnitInformation } from "@linguardian/shared/contracts";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

interface ListUnitsProps {
  userIsLearningThisList: boolean;
  unitInformation: UnitInformation;
  listNumber: number;
}

export default function ListUnits({
  userIsLearningThisList,
  unitInformation,
  listNumber,
}: ListUnitsProps) {
  return (
    <div className="tablet:col-span-2 desktopxl:row-start-2" id="listUnits">
      <div
        className={cn(
          "my-2 flex w-full flex-col gap-y-2 tablet:m-0 desktop:pb-2 tablet:pb-20",
          !userIsLearningThisList && "pb-24 tablet:pb-2"
        )}
      >
        {unitInformation?.map(({ fillWidth, unitName, noOfItems }, index) => {
          return (
            <Link
              key={index}
              href={paths.unitDetailsPath(listNumber, index + 1)}
              className="flex w-full justify-center"
            >
              <UnitButton
                fillWidth={fillWidth}
                unitName={unitName}
                noOfItemsInUnit={noOfItems}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
