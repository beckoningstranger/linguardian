import { useCallback } from "react";
import toast from "react-hot-toast";

import { useUser } from "@/context/UserContext";
import { updateLearnedItemsAction } from "@/lib/actions/user-actions";
import { ItemToLearn, LearningMode, SupportedLanguage } from "@/lib/contracts";
import { useRouter } from "next/navigation";
import paths from "../paths";

export function useLearningSessionSync() {
  const { user } = useUser();
  const router = useRouter();
  if (!user) throw new Error("Could not get user");

  const sendSessionData = useCallback(
    async (
      learnedItems: ItemToLearn[],
      language: SupportedLanguage,
      mode: LearningMode
    ) => {
      const itemsForServer = learnedItems.map((item) => ({
        id: item.id,
        increaseLevel: item.increaseLevel,
      }));

      const response = await toast.promise(
        updateLearnedItemsAction(itemsForServer, language, mode, user.id),
        {
          loading: "Updating your learning data...",
          success: (res) => res.message,
          error: (err) => (err instanceof Error ? err.message : err.toString()),
        }
      );

      if (response) router.push(paths.dashboardLanguagePath(language));
    },
    [user.id, router]
  );

  return { sendSessionData };
}
