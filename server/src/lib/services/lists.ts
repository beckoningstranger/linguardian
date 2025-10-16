import {
  EditListPageData,
  EditListPageDataParams,
  ListOverviewData,
  ListOverviewDataParams,
} from "@/lib/contracts";
import {
  generateLearningStats,
  getAllUnitInformation,
  logObjectPropertySizes,
} from "@/lib/utils";
import { getPopulatedListByListNumber } from "@/models/lists.model";
import { getAuthors, getUser } from "@/models/users.model";

export async function ListOverviewDataService(
  { listNumber }: ListOverviewDataParams,
  userId: string
): Promise<ListOverviewData> {
  const [userResponse, listResponse] = await Promise.all([
    getUser({ method: "_id", query: userId }),
    getPopulatedListByListNumber(listNumber),
  ]);

  if (!userResponse.success) throw new Error("User not found");
  if (!listResponse.success) throw new Error("List not found");

  const user = userResponse.data;
  const list = listResponse.data;
  const userIsAuthor = list.authors.includes(user.id);

  const learnedLists = user.learnedLists[list.language.code];
  const userIsLearningThisList =
    Array.isArray(learnedLists) && learnedLists.includes(list.listNumber);

  const userIsLearningListLanguage = user.learnedLanguages.some(
    (lang) => lang.code === list.language.code
  );

  const unlockedLearningModesForUser =
    list.unlockedReviewModes[user.native.code] ?? [];

  const learnedItems = user.learnedItems[list.language.code] ?? [];
  const ignoredItems = user.ignoredItems[list.language.code] ?? [];

  const learnedItemIds = learnedItems.map((item) => item.id);
  const ignoredItemIds = [...ignoredItems];

  const authorDataResponse = await getAuthors(list.authors);

  if (!authorDataResponse.success) {
    throw new Error(`Could not fetch author data: ${authorDataResponse.error}`);
  }

  const unitItems = list.units.map(({ item }) => item);
  const learningStats = generateLearningStats(
    unitItems,
    learnedItems,
    ignoredItemIds,
    user.native.code
  );

  const unitInformation = getAllUnitInformation(
    list.units,
    learnedItemIds,
    list.unitOrder
  );

  const returnPackage: ListOverviewData = {
    unitInformation,
    listLanguage: list.language,
    listImage: list.image,
    listDescription: list.description,
    listName: list.name,
    learningStats,
    unlockedLearningModesForUser,
    userIsAuthor,
    userIsLearningThisList,
    userIsLearningListLanguage,
    authorData: authorDataResponse.data,
    learnedItemIds,
    ignoredItemIds,
    listStatus: "practice",
  };
  // logObjectPropertySizes(returnPackage);
  return returnPackage;
}

export async function EditListPageDataService(
  { listNumber }: EditListPageDataParams,
  userId: string
): Promise<EditListPageData> {
  const userResponse = await getUser({ method: "_id", query: userId });
  if (!userResponse.success) throw new Error("Could not get user");
  const user = userResponse.data;

  const listResponse = await getPopulatedListByListNumber(listNumber);
  if (!listResponse.success) throw new Error("Could not get list");
  const list = listResponse.data;

  const authorDataResponse = await getAuthors(list.authors);
  if (!authorDataResponse.success) throw new Error("Could not get authors");

  const userIsAuthor = list.authors.includes(user.id);
  const learnedItemIds =
    user.learnedItems[list.language.code]?.map((item) => item.id) ?? [];

  const unitInformation = getAllUnitInformation(
    list.units,
    learnedItemIds,
    list.unitOrder
  );

  const returnPackage: EditListPageData = {
    listLanguage: list.language,
    listName: list.name,
    listDescription: list.description,
    listImage: list.image,
    unitOrder: list.unitOrder,
    learnedItemIds,
    userIsAuthor,
    authorData: authorDataResponse.data,
    unitInformation,
  };
  // logObjectPropertySizes(returnPackage);
  return returnPackage;
}
