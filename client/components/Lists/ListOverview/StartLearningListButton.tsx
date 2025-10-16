"use client";

import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsMortarboard } from "react-icons/bs";

import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import { useListContext } from "@/context/ListContext";
import { useUser } from "@/context/UserContext";
import { useUserUpdater } from "@/lib/hooks/useUserUpdater";

interface StartLearningListButtonProps {
  mode: "mobile" | "desktop";
}

export default function StartLearningListButton({
  mode,
}: StartLearningListButtonProps) {
  const {
    listNumber,
    listName,
    listLanguage: newLanguage,
    userIsLearningThisList,
    userIsLearningListLanguage,
  } = useListContext();
  const [updating, setUpdating] = useState(false);
  const { user, setActiveLanguage } = useUser();
  const applyUserUpdate = useUserUpdater();
  const router = useRouter();

  if (userIsLearningThisList) return null;
  if (!user) throw new Error("User not found");

  const handleAddListToLearnedLists = async () => {
    setUpdating(true);

    const learnedLists = {
      ...user?.learnedLists,
      [newLanguage.code]: Array.from(
        new Set(
          [...(user?.learnedLists[newLanguage.code] ?? []), listNumber].flat()
        )
      ),
    };

    await toast.promise(applyUserUpdate({ id: user.id, learnedLists }), {
      loading: `Adding "${listName}" to your learned lists...`,
      success: `"${listName}" has been added to your learned lists! 🎉`,
      error: (err) => (err instanceof Error ? err.message : err.toString()),
    });

    setUpdating(false);
    router.refresh();
  };

  const startLearningLanguageAndList = async () => {
    const learnedLanguages = user?.learnedLanguages
      ? [...user.learnedLanguages, newLanguage]
      : [newLanguage];
    await toast.promise(applyUserUpdate({ id: user.id, learnedLanguages }), {
      loading: `Adding ${newLanguage.name} to your languages...`,
      success: `You are now learning ${newLanguage.name}! 🎉`,
      error: (err) => (err instanceof Error ? err.message : err.toString()),
    });

    setActiveLanguage(newLanguage);
    await handleAddListToLearnedLists();
  };

  if (mode === "mobile")
    return (
      <>
        {!userIsLearningListLanguage && (
          <Button
            id="startLearningButtonMobile"
            onClick={startLearningLanguageAndList}
            disabled={updating}
            className="fixed bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:hidden tablet:px-4"
          >
            <BsMortarboard className="h-16 w-16" />
            <p className="absolute right-2 flex w-[calc(100vw-80px)] flex-wrap justify-center overflow-hidden text-hsm tablet:w-[calc(100vw-16px)] tablet:text-hmd desktop:hidden">
              Start learning {newLanguage.name} with this list!
            </p>
          </Button>
        )}
        {userIsLearningListLanguage && (
          <Button
            onClick={handleAddListToLearnedLists}
            disabled={updating}
            className="fixed bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:hidden tablet:px-4"
          >
            <BsMortarboard className="h-16 w-16" />
            <p className="absolute right-2 flex w-[calc(100vw-80px)] flex-wrap justify-center text-hsm tablet:w-[calc(100vw-16px)] tablet:text-hmd desktop:hidden">
              Start learning this list!
            </p>
          </Button>
        )}
      </>
    );

  if (mode === "desktop")
    return !userIsLearningListLanguage ? (
      <IconSidebarButton
        id="startLearningButtonDesktop"
        label={`Start learning ${newLanguage.name} with this list`}
        mode="start"
        disabled={updating}
        onClick={startLearningLanguageAndList}
      />
    ) : (
      <IconSidebarButton
        mode="start"
        disabled={updating}
        onClick={handleAddListToLearnedLists}
      />
    );
}
