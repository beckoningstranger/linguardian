import {
  ItemWithPopulatedTranslations,
  LearnedItem,
  ListAndUnitData,
  SupportedLanguage,
} from "@/lib/types";
import ListAddItemButton from "./ListAddItemButton";
import UnitItem from "./UnitItem";

interface UnitItemsProps {
  unitItems: ItemWithPopulatedTranslations[];
  allLearnedItems: LearnedItem[];
  userNative: SupportedLanguage;
  userIsAuthor: boolean;
  pathToUnit: string;
  listAndUnitData: ListAndUnitData;
}

export interface ItemPlusLearningInfo extends ItemWithPopulatedTranslations {
  learned: boolean;
  nextReview?: number;
  level?: number;
}

export default function UnitItems({
  unitItems,
  allLearnedItems,
  userNative,
  userIsAuthor,
  pathToUnit,
  listAndUnitData,
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
        userIsAuthor={userIsAuthor}
      />
    );
    item.learned
      ? learnedItems.push(renderedItem)
      : unlearnedItems.push(renderedItem);
  });

  return (
    <div className="relative col-span-1 col-start-1 grid grid-cols-1 justify-items-center gap-2 desktop:grid-cols-2 desktopxl:row-start-2">
      {learnedItems} {unlearnedItems}
      {userIsAuthor && <ListAddItemButton addToThisList={listAndUnitData} />}
    </div>
  );
}
