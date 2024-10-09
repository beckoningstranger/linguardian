import {
  LearnedItem,
  LearningDataForLanguage,
  ListStats,
  ListStatus,
} from "@/lib/types";
import { Types } from "mongoose";

export function calculateListStats(
  allItemObjectIds: Types.ObjectId[],
  learnedItems: LearnedItem[],
  ignoredItemObjectIds: Types.ObjectId[]
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

export function determineListStatus(stats: ListStats): ListStatus {
  if (stats.readyToReview > 0) return "review";
  if (stats.readyToReview === 0 && stats.unlearned > 0) return "add";
  return "practice";
}

export function generateStats(
  ignoredItemIds: Types.ObjectId[],
  learnedItems: LearnedItem[],
  allItemIDs: Types.ObjectId[],
  selectedlearnedItems: Types.ObjectId[]
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
        item.level > 8
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

export function getListStatsAndStatus(
  itemIdsInUnits: Types.ObjectId[],
  learningData: LearningDataForLanguage | undefined
) {
  let learnedItems: LearnedItem[] = [];
  let ignoredItems: Types.ObjectId[] = [];
  if (learningData) {
    learnedItems = learningData.learnedItems;
    ignoredItems = learningData.ignoredItems;
  }
  const listStats = calculateListStats(
    itemIdsInUnits,
    learnedItems,
    ignoredItems
  );
  const listStatus = determineListStatus(listStats);
  return { listStats, listStatus };
}
