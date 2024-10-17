import { FullyPopulatedList, LearningDataForLanguage } from "@/lib/types";
import { generateStats } from "./ListHelpers";

export async function calculateUnitStats(
  unitName: string,
  learningDataForLanguage: LearningDataForLanguage,
  listData: FullyPopulatedList
) {
  const { learnedItems, ignoredItems } = learningDataForLanguage;

  const selectedUnitData = listData.units.filter(
    (unit) => unit.unitName === unitName
  );
  if (!selectedUnitData)
    throw new Error("Unit not found, unable to calculate stats");

  const itemIDsInUnit = selectedUnitData.map((unitItem) =>
    unitItem.item._id.toString()
  );
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
