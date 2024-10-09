"use client";

import { setLearnedLists } from "@/lib/actions";
import { SupportedLanguage, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../Spinner";

interface StopLearningListButtonProps {
  list: { language: SupportedLanguage; listNumber: number; name: string };
}

export default function StopLearningListButton({
  list,
}: StopLearningListButtonProps) {
  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const user = data?.user as User;
  const { language, listNumber, name } = list;

  const handleRemoveList = async () => {
    setUpdating(true);
    const updatedLearnedLists = user.learnedLists[language]
      ? {
          ...user.learnedLists,
          [language]: user.learnedLists[language]?.filter(
            (number) => number !== listNumber
          ),
        }
      : {
          [language]: [],
        };

    try {
      toast.promise(
        setLearnedLists(listNumber, updatedLearnedLists, language),
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
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <button onClick={handleRemoveList} disabled={updating}>
      Remove list & Stop learning
    </button>
  );
}
