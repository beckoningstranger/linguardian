import {
  EditUnitData,
  ItemPlusLearningInfo,
  UnitDataParams,
  UnitOverviewData,
} from "@/lib/contracts";
import { generateLearningStats, logObjectPropertySizes } from "@/lib/utils";
import { getFullyPopulatedListByListNumber } from "@/models/list.model";
import { getAuthors, getUser } from "@/models/user.model";

export async function UnitOverviewDataService(
  { listNumber, unitNumber }: UnitDataParams,
  userId: string
): Promise<UnitOverviewData> {
  const userResponse = await getUser({ method: "_id", query: userId });
  if (!userResponse.success) throw new Error("Could not get user");
  const user = userResponse.data;

  const listResponse = await getFullyPopulatedListByListNumber(listNumber);
  if (!listResponse.success) throw new Error("Could not get list");

  const list = listResponse.data;

  const userIsAuthor = list.authors.includes(user.id);

  const learnedLists = user.learnedLists[list.language.code];
  const userIsLearningThisList =
    Array.isArray(learnedLists) && learnedLists.includes(list.listNumber);

  const learnedItems = user.learnedItems[list.language.code] ?? [];
  const ignoredItems = user.ignoredItems[list.language.code] ?? [];
  const ignoredItemIds = [...ignoredItems];

  const authorDataResponse = await getAuthors(list.authors);

  if (!authorDataResponse.success) {
    throw new Error(`Could not fetch author data: ${authorDataResponse.error}`);
  }

  const unitName = list.unitOrder[unitNumber - 1];
  const itemIdsInUnit = list.units
    .filter((unit) => unit.unitName === unitName)
    .map(({ item }) => item);
  const learningStats = generateLearningStats(
    itemIdsInUnit,
    learnedItems,
    ignoredItemIds,
    user.native.code
  );
  const unitItems = list.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const learnedItemsForListLanguage = user.learnedItems[list.language.code];
  const itemsPlusLearningInfo = unitItems.map((item) => {
    const foundLearnedItem = learnedItemsForListLanguage?.find(
      (learnedItem) => learnedItem.id === item.id
    );
    if (foundLearnedItem)
      return {
        ...item,
        learned: true,
        nextReview: foundLearnedItem.nextReview,
        level: foundLearnedItem.level,
      } as ItemPlusLearningInfo;
    else return { ...item, learned: false } as ItemPlusLearningInfo;
  });

  const returnPackage = {
    listLanguage: list.language,
    listName: list.name,
    unitItems,
    itemsPlusLearningInfo,
    userNativeCode: user.native.code,
    userIsAuthor,
    userIsLearningThisList,
    unitName,
    learnedItems,
    ignoredItemIds,
    learningStats,
    unitOrder: list.unitOrder,
  };
  // logObjectPropertySizes(returnPackage);
  return returnPackage;
}

export async function EditUnitDataService(
  { listNumber, unitNumber }: UnitDataParams,
  userId: string
): Promise<EditUnitData> {
  const userResponse = await getUser({ method: "_id", query: userId });
  if (!userResponse.success) throw new Error("Could not get user");
  const user = userResponse.data;

  const listResponse = await getFullyPopulatedListByListNumber(listNumber);
  if (!listResponse.success) throw new Error("Could not get list");
  const list = listResponse.data;

  const userIsAuthor = list.authors.includes(user.id);
  const unitName = list.unitOrder[unitNumber - 1];
  const unitItems = list.units
    .filter((unit) => unit.unitName === unitName)
    .map((unitItem) => unitItem.item);

  const learnedLists = user.learnedLists[list.language.code];
  const userIsLearningThisList =
    Array.isArray(learnedLists) && learnedLists.includes(list.listNumber);

  const learnedItemsForListLanguage = user.learnedItems[list.language.code];
  const itemsPlusLearningInfo = unitItems.map((item) => {
    const foundLearnedItem = learnedItemsForListLanguage?.find(
      (learnedItem) => learnedItem.id === item.id
    );
    if (foundLearnedItem)
      return {
        ...item,
        learned: true,
        nextReview: foundLearnedItem.nextReview,
        level: foundLearnedItem.level,
      } as ItemPlusLearningInfo;
    else return { ...item, learned: false } as ItemPlusLearningInfo;
  });

  const returnPackage = {
    unitName,
    unitOrder: list.unitOrder,
    unitItems,
    itemsPlusLearningInfo,
    userIsLearningThisList,
    userNativeCode: user.native.code,
    userIsAuthor,
    listName: list.name,
    listLanguage: list.language,
  };
  // logObjectPropertySizes(returnPackage);
  return returnPackage;
}
