"use client";

import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BsMortarboard } from "react-icons/bs";

import Spinner from "@/components/Spinner";
import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useListContext } from "@/context/ListContext";
import { setLearnedLanguages, setLearnedLists } from "@/lib/actions";
import { User } from "@/lib/types";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";

interface StartLearningListButtonProps {
  mode: "mobile" | "desktop";
}

export default function StartLearningListButton({
  mode,
}: StartLearningListButtonProps) {
  const {
    listData: { listNumber, language, name },
    userIsLearningThisList,
    userIsLearningListLanguage,
  } = useListContext();

  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const user = data?.user as User;
  const { setActiveLanguage } = useActiveLanguage();
  if (userIsLearningThisList) return null;

  const handleAddListToLearnedLists = async () => {
    setUpdating(true);

    const updatedLearnedLists = {
      ...user.learnedLists,
      [language.code]: Array.from(
        new Set(
          [...(user.learnedLists[language.code] ?? []), listNumber].flat()
        )
      ),
    };

    await toast.promise(
      setLearnedLists(listNumber, updatedLearnedLists, language.code),
      {
        loading: `Adding "${name}" to your learned lists...`,
        success: `"${name}" has been added to your learned lists! 🎉`,
        error: (err) => err.toString(),
      }
    );

    await update({ ...data, user: { learnedLists: updatedLearnedLists } });
    setUpdating(false);
  };

  const startLearningLanguageAndList = async () => {
    const updatedIsLearning = user.learnedLanguages
      ? [...user.learnedLanguages, language]
      : [language];
    await toast.promise(setLearnedLanguages(updatedIsLearning), {
      loading: `Adding ${language.name} to your languages...`,
      success: `You are now learning ${language.name}! 🎉`,
      error: (err) => err.toString(),
    });

    await update({
      ...data,
      user: {
        ...user,
        updatedIsLearning,
        activeLanguageAndFlag: language,
      },
    });
    setActiveLanguage(language);
    await handleAddListToLearnedLists();
  };

  if (status === "loading" || updating) return <Spinner centered />;

  if (mode === "mobile")
    return (
      <>
        {!userIsLearningListLanguage && (
          <Button
            onClick={startLearningLanguageAndList}
            disabled={updating}
            className="absolute bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:hidden tablet:px-4"
          >
            <BsMortarboard className="h-16 w-16" />
            <p className="absolute right-2 flex w-[calc(100vw-80px)] flex-wrap justify-center overflow-hidden text-hsm tablet:w-[calc(100vw-16px)] tablet:text-hmd desktop:hidden">
              Start learning {language.name} with this list!
            </p>
          </Button>
        )}
        {userIsLearningListLanguage && (
          <Button
            onClick={handleAddListToLearnedLists}
            disabled={updating}
            className="absolute bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:hidden tablet:px-4"
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
        label={`Start learning ${language.name} with this list`}
        type="start"
        disabled={updating}
        onClick={startLearningLanguageAndList}
      />
    ) : (
      <IconSidebarButton
        type="start"
        disabled={updating}
        onClick={handleAddListToLearnedLists}
      />
    );
}
