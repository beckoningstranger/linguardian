import { generateStats } from "./ListHelpers";
import {
  FullyPopulatedList,
  LearnedLanguageWithPopulatedLists,
} from "@/lib/types";

export async function calculateUnitStats(
  unitName: string,
  learnedLanguageData: LearnedLanguageWithPopulatedLists,
  listData: FullyPopulatedList
) {
  const learnedItems = learnedLanguageData.learnedItems;
  const ignoredItems = learnedLanguageData.ignoredItems;

  const selectedUnitData = listData.units.filter(
    (unit) => unit.unitName === unitName
  );
  if (!selectedUnitData)
    throw new Error("Unit not found, unable to calculate stats");

  const itemIDsInUnit = selectedUnitData.map((unitItem) => unitItem.item._id);
  const userlearnedItemIDs = learnedItems.map((item) => item.id);
  const learnedItemsInList = userlearnedItemIDs.filter((id) =>
    itemIDsInUnit.includes(id)
  );

  return generateStats(
    ignoredItems,
    learnedItems,
    itemIDsInUnit,
    learnedItemsInList
  );
}
