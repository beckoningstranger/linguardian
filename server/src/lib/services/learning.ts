import {
  FetchLearningSessionParams,
  ItemToLearn,
  ItemWithPopulatedTranslations,
  LearningSessionData,
  SRSettings,
} from "@/lib/contracts";
import { getFullyPopulatedListByListNumber } from "@/models/lists.model";
import { getUser } from "@/models/users.model";
import { allLanguageFeatures, defaultSRSettings } from "../siteSettings";

export async function LearningSessionDataService({
  listNumber,
  mode,
  unitNumber,
  userId,
}: FetchLearningSessionParams & {
  userId: string;
}): Promise<LearningSessionData> {
  const userResponse = await getUser({ method: "_id", query: userId });
  if (!userResponse.success) throw new Error("Could not find user");
  const user = userResponse.data;
  const listResponse = await getFullyPopulatedListByListNumber(listNumber);
  if (!listResponse.success) throw new Error("Could not find list");
  const list = listResponse.data;
  const sSRSettings: SRSettings =
    user.customSRSettings?.[list.language.code] || defaultSRSettings;
  const targetLanguageFeatures = allLanguageFeatures.find(
    (lf) => lf.langCode === list.language.code
  )!;

  // This is for creating wrong answers in learning sessions
  const allItemStringsInList = list.units.map((unitItem) => unitItem.item.name);

  const sortedItemsInList = [...list.units].sort(
    (a, b) =>
      list.unitOrder.indexOf(a.unitName) - list.unitOrder.indexOf(b.unitName)
  );

  const allItemsDueForReview = user?.learnedItems?.[list.language.code]?.filter(
    (learnedItem) => learnedItem.nextReview < Date.now()
  );

  const allItemsDueForReviewIncludedInListAndUnit =
    allItemsDueForReview?.filter((dueItem) =>
      sortedItemsInList.some((sortedItem) => {
        return sortedItem.item.id === dueItem.id;
      })
    ) ?? [];

  const allLearnedItemIds =
    user?.learnedItems?.[list.language.code]?.map(
      (learnedItem) => learnedItem.id
    ) ?? [];

  const allLearnedItemIdsOfDueItems =
    allItemsDueForReviewIncludedInListAndUnit.map(
      (learnedItem) => learnedItem.id
    );

  const filteredUnits = unitNumber
    ? sortedItemsInList.filter(
        (sortedItem) =>
          list.unitOrder.indexOf(sortedItem.unitName) === unitNumber - 1
      )
    : sortedItemsInList;

  const processedItems: ItemWithPopulatedTranslations[] = filteredUnits.map(
    (unitItem) => unitItem.item
  );

  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemToLearn[] = [];
  processedItems.forEach((item) => {
    if (
      mode === "learn" &&
      !allLearnedItemIds.includes(item.id) &&
      Object.keys(item.translations[user.native.code] ?? {}).length > 0 // filter items with no translations (for this user)
    ) {
      allLearnableItems.push({ ...item, increaseLevel: true, learningStep: 0 });
    }
    if (
      mode === "translation" &&
      allLearnedItemIdsOfDueItems.includes(item.id) &&
      Object.keys(item.translations[user.native.code] ?? {}).length > 0
    ) {
      allReviewableItems.push({
        ...item,
        increaseLevel: true,
        learningStep: 3,
      });
    }
  });

  const items =
    mode === "learn"
      ? allLearnableItems.slice(0, sSRSettings.itemsPerSession.learning)
      : allReviewableItems.slice(0, sSRSettings.itemsPerSession.reviewing);

  return {
    targetLanguageFeatures,
    listName: list.name,
    allItemStringsInList,
    items,
  };
}
