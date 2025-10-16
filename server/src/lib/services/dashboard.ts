import {
  DashboardData,
  DashboardDataParams,
  LearnedItem,
  ListForDashboard,
  SupportedLanguage,
  User,
} from "@/lib/contracts";
import { generateLearningStats, sanitizeUser } from "@/lib/utils";
import { getPopulatedListByListNumber } from "@/models/lists.model";
import { getUser } from "@/models/users.model";

export async function DashboardDataService(
  { language }: DashboardDataParams,
  userId: string
): Promise<DashboardData> {
  const userResponse = await getUser({ method: "_id", query: userId });
  if (!userResponse.success) throw new Error("User not found");

  const user: User = sanitizeUser(userResponse.data);

  const learnedListsForLanguage = user.learnedLists[language];
  const learnedItemsForLanguage = user.learnedItems[language];
  const ignoredItemIdsForLanguage = user.ignoredItems[language];
  const listsForDashboard = learnedListsForLanguage
    ? await generateListsForDashboard(
        learnedListsForLanguage,
        learnedItemsForLanguage ?? [],
        ignoredItemIdsForLanguage ?? [],
        user.native.code
      )
    : [];

  return {
    listsForDashboard,
  };
}

async function generateListsForDashboard(
  learnedLists: number[],
  learnedItems: LearnedItem[],
  ignoredItemIds: string[],
  userNative: SupportedLanguage
): Promise<ListForDashboard[]> {
  const listsForDashboardPromises = learnedLists.map(
    async (learnedListNumber) => {
      const listResponse = await getPopulatedListByListNumber(
        learnedListNumber
      );
      if (!listResponse.success)
        throw new Error(`Could not fetch list data: ${listResponse.error}`);
      const list = listResponse.data;
      const itemIdsInUnits = list.units.map(({ item }) => item);
      const learningStatsForUser = generateLearningStats(
        itemIdsInUnits,
        learnedItems,
        ignoredItemIds,
        userNative
      );
      const unlockedReviewModesForUser =
        list.unlockedReviewModes[userNative] ?? [];

      return {
        ...listResponse.data,
        learningStatsForUser,
        unlockedReviewModesForUser,
      };
    }
  );

  return await Promise.all(listsForDashboardPromises);
}
