import { LearnedItem, List, ListStats, ListStatus } from "@/types";
import { Types } from "mongoose";

export function calculateListStats(
  list: List,
  learnedItems: LearnedItem[],
  ignoredItems: Types.ObjectId[]
): ListStats {
  const itemIDsInList = list.units.map((unitItem) => unitItem.item);
  const userlearnedItemIDs = learnedItems.map((item) => item.id);
  const learnedItemsInList = userlearnedItemIDs.filter((id) =>
    itemIDsInList.includes(id)
  );

  return generateStats(
    ignoredItems,
    learnedItems,
    itemIDsInList,
    learnedItemsInList
  );
}

export function determineListStatus(stats: ListStats): ListStatus {
  if (stats.readyToReview > 0) return "review";
  if (stats.readyToReview === 0 && stats.unlearned > 0) return "add";
  return "practice";
}

export function generateStats(
  allIgnoredItems: Types.ObjectId[],
  allLearnedItems: LearnedItem[],
  itemIDs: Types.ObjectId[],
  selectedlearnedItems: Types.ObjectId[]
) {
  const ignoredItemsInList = allIgnoredItems.filter((id) =>
    itemIDs.includes(id)
  );

  const readyToReview = allLearnedItems.filter(
    (item) =>
      itemIDs.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      item.nextReview < Date.now()
  );

  const learned = allLearnedItems.filter(
    (item) =>
      itemIDs.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      !readyToReview.includes(item) &&
      item.level > 8
  );

  const learning = allLearnedItems.filter(
    (item) =>
      itemIDs.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      !readyToReview.includes(item) &&
      item.level < 8
  );

  return {
    unlearned: itemIDs.length - selectedlearnedItems.length,
    readyToReview: readyToReview.length,
    learned: learned.length,
    learning: learning.length,
    ignored: ignoredItemsInList.length,
  };
}
