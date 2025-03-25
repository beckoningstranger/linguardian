import { LearnedItem, LearningDataForLanguage, ListStats } from "@/lib/types";

export function calculateListStats(
  allItemObjectIds: string[],
  learnedItems: LearnedItem[],
  ignoredItemObjectIds: string[]
): ListStats {
  const learnedItemIds = learnedItems?.map((item) => item.id);
  const learnedItemIdsInList = learnedItemIds?.filter((id) =>
    allItemObjectIds.includes(id)
  );

  return generateStats(
    ignoredItemObjectIds,
    learnedItems,
    allItemObjectIds,
    learnedItemIdsInList
  );
}

export function generateStats(
  ignoredItemIds: string[],
  learnedItems: LearnedItem[],
  allItemIDs: string[],
  selectedlearnedItems: string[]
) {
  const ignoredItemsInList =
    ignoredItemIds?.filter((id) => allItemIDs.includes(id)) || [];

  const readyToReview =
    learnedItems?.filter(
      (item) =>
        allItemIDs.includes(item.id) &&
        !ignoredItemsInList.includes(item.id) &&
        item.nextReview < Date.now()
    ) || [];

  const learned =
    learnedItems?.filter(
      (item) =>
        allItemIDs.includes(item.id) &&
        !ignoredItemsInList.includes(item.id) &&
        !readyToReview.includes(item) &&
        item.level >= 8
    ) || [];

  const learning =
    learnedItems?.filter(
      (item) =>
        allItemIDs.includes(item.id) &&
        !ignoredItemsInList.includes(item.id) &&
        !readyToReview.includes(item) &&
        item.level < 8
    ) || [];

  return {
    unlearned:
      allItemIDs.length -
      (selectedlearnedItems ? selectedlearnedItems.length : 0),
    readyToReview: readyToReview.length,
    learned: learned.length,
    learning: learning.length,
    ignored: ignoredItemsInList.length,
  };
}

export function getListStats(
  itemIdsInUnits: string[],
  learningData: LearningDataForLanguage | undefined
) {
  let learnedItems: LearnedItem[] = [];
  let ignoredItems: string[] = [];
  if (learningData) {
    learnedItems = learningData.learnedItems;
    ignoredItems = learningData.ignoredItems;
  }
  const listStats = calculateListStats(
    itemIdsInUnits,
    learnedItems,
    ignoredItems
  );
  return listStats;
}
