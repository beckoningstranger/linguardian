import { LearnedItem, List, ListStats } from "@/types";
import { Types } from "mongoose";

export function calculateListStats(
  list: List,
  learnedItems: LearnedItem[],
  ignoredItems: Types.ObjectId[]
): ListStats {
  console.log("LIst", list);
  console.log("Learned", learnedItems);
  const itemIDsInList = list.units.map((unitItem) => unitItem.item);
  const userlearnedItemIDs = learnedItems.map((item) => item.id);
  const learnedItemsInList = userlearnedItemIDs.filter((id) =>
    itemIDsInList.includes(id)
  );

  const ignoredItemsInList = ignoredItems.filter((id) =>
    itemIDsInList.includes(id)
  );

  const readyToReview = learnedItems.filter(
    (item) =>
      itemIDsInList.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      item.nextReview < Date.now()
  );

  const learned = learnedItems.filter(
    (item) =>
      itemIDsInList.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      !readyToReview.includes(item) &&
      item.level > 8
  );

  const learning = learnedItems.filter(
    (item) =>
      itemIDsInList.includes(item.id) &&
      !ignoredItemsInList.includes(item.id) &&
      !readyToReview.includes(item) &&
      item.level < 8
  );

  return {
    unlearned: itemIDsInList.length - learnedItemsInList.length,
    readyToReview: readyToReview.length,
    learned: learned.length,
    learning: learning.length,
    ignored: ignoredItemsInList.length,
  };
}
