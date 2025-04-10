"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenuButton";
import { useListContext } from "@/context/ListContext";
import { setLearnedLists } from "@/lib/actions";
import { User } from "@/lib/types";
import Spinner from "../../Spinner";

interface StopLearningListButtonProps {
  mode: "mobile" | "desktop";
}

export default function StopLearningListButton({
  mode,
}: StopLearningListButtonProps) {
  const {
    listData: { listNumber, language, name },
    userIsLearningThisList,
  } = useListContext();

  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const user = data?.user as User;

  const handleRemoveList = async () => {
    setUpdating(true);

    const updatedLearnedLists = user.learnedLists[language.code]
      ? {
          ...user.learnedLists,
          [language.code]: user.learnedLists[language.code]?.filter(
            (number) => number !== listNumber
          ),
        }
      : {
          [language.code]: [],
        };

    await toast.promise(
      setLearnedLists(listNumber, updatedLearnedLists, language.code),
      {
        loading: `Removing "${name}" from your learned lists...`,
        success: `"${name}" has been removed from your learned lists! 🎉`,
        error: (err) => err.toString(),
      }
    );
    await update({
      ...data,
      user: { ...user, learnedLists: updatedLearnedLists },
    });
    setUpdating(false);
  };

  if (status === "loading" || updating) return <Spinner centered />;
  if (!userIsLearningThisList) return null;

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
        type="stop"
        disabled={updating}
        onClick={handleRemoveList}
      />
    );
}
