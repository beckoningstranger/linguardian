import {
  DashboardData,
  DashboardDataParams,
  LearnedItem,
  LearningModeWithInfo,
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

  const modesAvailableForAllLists: LearningModeWithInfo[] = [];
  // First do a round for items that are actually due
  listsForDashboard.forEach((list) =>
    list.learningStatsForUser.availableModesWithInfo.forEach(
      (currModeWithInfo) => {
        const exists = modesAvailableForAllLists.find(
          (modeWithInfo) => modeWithInfo.mode === currModeWithInfo.mode
        );
        if (
          !exists &&
          currModeWithInfo.mode !== "learn" &&
          !currModeWithInfo.overstudy
        )
          modesAvailableForAllLists.push(currModeWithInfo);
        if (exists && exists.mode !== "overstudy" && !exists.overstudy) {
          exists.number += currModeWithInfo.number;
          // For all modes that are not overstudy, info is a stringified number
          exists.info = (
            parseInt(exists.info) + currModeWithInfo.number
          ).toString();
        }
      }
    )
  );

  // Then, if nothing needs reviewing, we can do the same but for overstudy
  if (modesAvailableForAllLists.length === 0) {
    listsForDashboard.forEach((list) =>
      list.learningStatsForUser.availableModesWithInfo.forEach(
        (currModeWithInfo) => {
          const exists = modesAvailableForAllLists.find(
            (modeWithInfo) => modeWithInfo.mode === currModeWithInfo.mode
          );
          if (!exists && currModeWithInfo.mode !== "learn")
            modesAvailableForAllLists.push(currModeWithInfo);
          if (exists && exists.mode !== "overstudy") {
            exists.number += currModeWithInfo.number;
            // For all modes that are not overstudy, info is a stringified number
            exists.info = (
              parseInt(exists.info) + currModeWithInfo.number
            ).toString();
          }
        }
      )
    );
  }

  return {
    listsForDashboard,
    modesAvailableForAllLists,
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

      return {
        ...listResponse.data,
        learningStatsForUser,
      };
    }
  );

  return await Promise.all(listsForDashboardPromises);
}
