"use server";

import { revalidateTag } from "next/cache";

import {
  createUser,
  isTaken,
  updateLearnedItems,
  updateUser,
} from "@/lib/api/user-api";
import {
  ItemForServer,
  IsTakenParams,
  LearningMode,
  MessageResponse,
  RecentDictionarySearch,
  RegistrationData,
  SupportedLanguage,
  UpdateUser,
} from "@linguardian/shared/contracts";
import {
  executeAction,
  executeAuthenticatedAction,
  userTag,
} from "@/lib/utils";
import { getUserOnServer } from "@/lib/utils/server";
import { NUMBER_OF_RECENT_SEARCHES } from "../constants";

export async function updateUserAction(
  updates: UpdateUser
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => updateUser(updates),
    onSuccess: () => revalidateTag(userTag(updates.id), 'max'),
  });
}

export async function createUserAction(
  userData: RegistrationData
): Promise<MessageResponse> {
  return await executeAction({
    apiCall: () => createUser(userData),
  });
}

export async function isTakenAction(request: IsTakenParams): Promise<boolean> {
  return await executeAction({ apiCall: () => isTaken(request) });
}

export async function updateRecentSearchesAction(itemId: string) {
  const user = await getUserOnServer();
  if (!user) throw new Error("You need to be logged in");

  const newSearchObject: RecentDictionarySearch = {
    itemId,
    dateSearched: new Date().toISOString(),
  };

  const existingSearches = user.recentDictionarySearches ?? [];
  const combined = [newSearchObject, ...existingSearches];

  // Deduplicate by itemId, keeping the most recent
  const seen = new Set<string>();
  const deduplicated = combined.filter((search) => {
    if (seen.has(search.itemId)) return false;
    seen.add(search.itemId);
    return true;
  });

  // Sort by dateSearched (most recent first)
  deduplicated.sort(
    (a, b) =>
      new Date(b.dateSearched).getTime() - new Date(a.dateSearched).getTime()
  );

  // Keep only the most recent
  const sliced = deduplicated.slice(0, NUMBER_OF_RECENT_SEARCHES);

  return await executeAuthenticatedAction({
    apiCall: () =>
      updateUser({
        id: user.id,
        recentDictionarySearches: sliced,
      }),
    onSuccess: () => revalidateTag(userTag(user.id), 'max'),
  });
}

export async function updateLearnedItemsAction(
  items: ItemForServer[],
  language: SupportedLanguage,
  mode: LearningMode,
  userId: string
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => updateLearnedItems({ items, language, mode }, userId),
    onSuccess: () => {
      revalidateTag((userTag(userId)), 'max');
    },
  });
}
