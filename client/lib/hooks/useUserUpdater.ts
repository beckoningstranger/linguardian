"use client";

import { useUser } from "@/context/UserContext";
import { updateUserAction } from "@/lib/actions/user-actions";
import type { MessageResponse, UpdateUser, User } from "@linguardian/shared/contracts";

/**
 * Hook to update user context and persist changes to the backend.
 * Applies optimistic updates to the UI and revalidates server cache.
 *
 * Use for settings, profile updates, onboarding, etc.
 */
export function useUserUpdater() {
  const { user, setUser } = useUser();

  const updateUserAndSync = async (
    updates: UpdateUser
  ): Promise<MessageResponse> => {
    if (!user) throw new Error("No user in context");

    const optimisticUser: User = { ...user, ...updates };
    const previousUser: User = structuredClone(user);

    setUser(optimisticUser);
    const result = await updateUserAction(updates);
    if (!result) {
      setUser(previousUser);
    }

    return result;
  };

  return updateUserAndSync;
}
