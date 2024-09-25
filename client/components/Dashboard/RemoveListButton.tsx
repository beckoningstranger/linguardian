"use client";

import { removeListFromDashboard } from "@/lib/actions";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import CenteredSpinner from "../CenteredSpinner";

interface RemoveListButtonProps {
  listLanguage: SupportedLanguage;
  listNumber: number;
  listName: string;
  userId: string;
}

export default function RemoveListButton({
  listLanguage,
  listNumber,
  listName,
  userId,
}: RemoveListButtonProps) {
  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const sessionUser = data?.user as SessionUser;

  const handleRemoveList = async () => {
    setUpdating(true);
    await toast.promise(
      removeListFromDashboard(listNumber, listLanguage, userId),
      {
        loading: `Removing "${listName}" from your dashboard...`,
        success: `"${listName}" has been removed from your dashboard! 🎉`,
        error: (err) => {
          setUpdating(false);
          return err.toString();
        },
      }
    );

    const updatedLearnedLists = sessionUser.learnedLists[listLanguage]?.filter(
      (number) => number !== listNumber
    );
    update({
      ...data,
      user: { ...sessionUser, learnedLists: updatedLearnedLists },
    });
    setUpdating(false);
  };

  if (status === "loading") return <CenteredSpinner />;

  return (
    <button onClick={handleRemoveList} disabled={updating}>
      Remove list & Stop learning
    </button>
  );
}
