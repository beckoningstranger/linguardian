"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImStop } from "react-icons/im";

import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenuButton";
import { useListContext } from "@/context/ListContext";
import { setLearnedLists } from "@/lib/actions";
import { User } from "@/lib/types";
import Spinner from "../../Spinner";
import { Button } from "@headlessui/react";

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

  if (status === "loading") return <Spinner centered />;

  if (!userIsLearningThisList) return null;
  if (mode === "mobile")
    return (
      <TopContextMenuButton
        onClick={handleRemoveList}
        disabled={updating}
        label="Stop learning this list"
        mode="stop"
        icon={<ImStop className="h-16 w-16" />}
      />
    );

  if (mode === "desktop")
    return (
      <Button
        className="duration-800 group hidden size-[72px] items-center justify-center rounded-lg bg-white/90 text-grey-800 shadow-2xl ring-white transition-all ease-in-out hover:w-[400px] hover:bg-orange-600 hover:px-4 hover:text-white hover:ring-transparent tablet:flex"
        onClick={handleRemoveList}
      >
        <ImStop className="h-14 w-14" />

        <div className="hidden w-full justify-center rounded-lg font-serif text-hmd group-hover:flex">
          Stop learning this list
        </div>
      </Button>
    );
}
