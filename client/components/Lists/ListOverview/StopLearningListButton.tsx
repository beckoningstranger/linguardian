"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { IconSidebarButton, TopContextMenuButton } from "@/components";
import { useListContext } from "@/context/ListContext";
import { useUser } from "@/context/UserContext";
import { useUserUpdater } from "@/lib/hooks/useUserUpdater";

interface StopLearningListButtonProps {
  mode: "mobile" | "desktop";
}

export default function StopLearningListButton({
  mode,
}: StopLearningListButtonProps) {
  const router = useRouter();
  const { listNumber, listLanguage, listName, userIsLearningThisList } =
    useListContext();

  const applyUserUpdate = useUserUpdater();
  const [updating, setUpdating] = useState(false);
  const { user } = useUser();
  if (!user) throw new Error("User not found");

  if (!userIsLearningThisList) return null;

  const handleRemoveList = async () => {
    setUpdating(true);

    const learnedLists = user?.learnedLists[listLanguage.code]
      ? {
          ...user.learnedLists,
          [listLanguage.code]: user.learnedLists[listLanguage.code]?.filter(
            (number) => number !== listNumber
          ),
        }
      : {
          [listLanguage.code]: [],
        };

    await toast.promise(applyUserUpdate({ id: user.id, learnedLists }), {
      loading: `Removing "${listName}" from your learned lists...`,
      success: () => {
        return ` "${listName}" has been removed from your learned lists! 🎉`;
      },
      error: (err) => (err instanceof Error ? err.message : err.toString()),
    });

    setUpdating(false);
    router.refresh();
  };

  if (mode === "mobile")
    return (
      <TopContextMenuButton
        onClick={handleRemoveList}
        disabled={updating}
        mode="stop"
      />
    );

  if (mode === "desktop")
    return (
      <IconSidebarButton
        mode="stop"
        disabled={updating}
        onClick={handleRemoveList}
      />
    );
}
