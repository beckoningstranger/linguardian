import { cn } from "@/lib/helperFunctionsClient";
import {
  ItemPlusLearningInfo,
  ItemWithPopulatedTranslationsFE,
  LearnedItem,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import ListAddItemButton from "../EditUnit/ListAddItemButton";
import UnitItem from "./UnitItem";

interface UnitItemsProps {
  unitItems: ItemWithPopulatedTranslationsFE[];
  allLearnedItems: LearnedItem[];
  userNative: SupportedLanguage;
  userIsAuthor: boolean;
  pathToUnit: string;
  listAndUnitData: ListAndUnitData;
  userIsLearningThisList: boolean;
  editMode?: boolean;
}

export default function UnitItems({
  unitItems,
  allLearnedItems,
  userNative,
  userIsAuthor,
  pathToUnit,
  listAndUnitData,
  userIsLearningThisList,
  editMode,
}: UnitItemsProps) {
  const enrichedItems = unitItems.map((item) => {
    const enrichedItem = item as ItemPlusLearningInfo;
    const foundLearnedItem = allLearnedItems.find(
      (learnedItem) => learnedItem.id === item._id.toString()
    );
    if (foundLearnedItem) {
      enrichedItem.learned = true;
      enrichedItem.nextReview = foundLearnedItem.nextReview;
      enrichedItem.level = foundLearnedItem.level;
      return enrichedItem;
    }
    return { ...item, learned: false } as ItemPlusLearningInfo;
  });

  let learnedItems: JSX.Element[] = [];
  let unlearnedItems: JSX.Element[] = [];

  enrichedItems.forEach((item, index) => {
    const translations = item.translations[userNative]
      ?.map((trans) => trans.name)
      .join(", ");
    const renderedItem = (
      <UnitItem
        item={item}
        translations={translations}
        key={index}
        pathToUnit={pathToUnit}
        listAndUnitData={listAndUnitData}
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
        "mt-2 tablet:mt-0 relative col-span-1 col-start-1 grid justify-items-center gap-2",
        userIsLearningThisList &&
          "grid-cols-1 desktop:grid-cols-2 w-full tablet:w-auto desktopxl:row-start-2",
        !userIsLearningThisList &&
          "min-w-[340px] min-[900px]:grid-cols-2 desktopxl:grid-cols-3"
      )}
    >
      {learnedItems} {unlearnedItems}
      {userIsAuthor && editMode && (
        <ListAddItemButton addToThisList={listAndUnitData} />
      )}
    </div>
  );
}
