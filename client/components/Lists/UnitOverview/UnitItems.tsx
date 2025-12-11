import { ReactElement } from "react";
import UnitItem from "@/components/Lists/UnitOverview/UnitItem";
import { ItemPlusLearningInfo, SupportedLanguage } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface UnitItemsProps {
  itemsPlusLearningInfo: ItemPlusLearningInfo[];
  userNative: SupportedLanguage;
  userIsAuthor: boolean;
  pathToUnit: string;
  userIsLearningThisList: boolean;
  editMode?: boolean;
}

export default function UnitItems({
  itemsPlusLearningInfo,
  userNative,
  userIsAuthor,
  pathToUnit,
  userIsLearningThisList,
  editMode,
}: UnitItemsProps) {
  let learnedItems: ReactElement[] = [];
  let unlearnedItems: ReactElement[] = [];

  itemsPlusLearningInfo.forEach((item, index) => {
    const translations = item.translations?.[userNative]
      ?.map((trans) => trans.name)
      .join(", ");
    const renderedItem = (
      <UnitItem
        item={item}
        translations={translations}
        key={index}
        pathToUnit={pathToUnit}
        editMode={editMode}
      />
    );
    item.learned
      ? learnedItems.push(renderedItem)
      : unlearnedItems.push(renderedItem);
  });

  return (
    <div
      className={cn(
        "my-2 tablet:mt-0 relative col-span-1 col-start-1 grid justify-items-center gap-2",
        userIsLearningThisList &&
          "grid-cols-1 desktop:grid-cols-2 w-full tablet:w-auto desktopxl:row-start-2",
        !userIsLearningThisList &&
          "min-w-[340px] min-[900px]:grid-cols-2 desktopxl:grid-cols-3"
      )}
      id="UnitItems"
    >
      {learnedItems} {unlearnedItems}
    </div>
  );
}
