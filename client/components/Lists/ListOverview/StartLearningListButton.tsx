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
        success: () => `"${name}" has been added to your learned lists! 🎉`,
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

  if (status === "loading") return <Spinner centered />;

  if (mode === "mobile")
    return (
      <>
        {!userIsLearningListLanguage && (
          <Button
            onClick={startLearningLanguageAndList}
            disabled={updating}
            className="absolute bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:px-4 desktop:hidden"
          >
            <BsMortarboard className="h-16 w-16" />
            <p className="absolute right-2 flex w-[calc(100vw-80px)] flex-wrap justify-center text-hsm tablet:w-[calc(100vw-16px)] tablet:text-hmd desktop:hidden">
              Start learning {language.name} with this list!
            </p>
          </Button>
        )}
        {userIsLearningListLanguage && (
          <Button
            onClick={handleAddListToLearnedLists}
            disabled={updating}
            className="absolute bottom-0 flex h-24 w-full items-center bg-green-400 px-2 text-white active:bg-green-500 tablet:px-4 desktop:hidden"
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
    return (
      <>
        {!userIsLearningListLanguage && (
          <Button
            className="duration-800 group hidden size-[72px] items-center justify-center rounded-lg bg-green-400 text-white shadow-2xl ring-white transition-all ease-in-out hover:w-[400px] hover:bg-green-400 hover:px-4 hover:text-white hover:ring-transparent desktop:flex"
            onClick={startLearningLanguageAndList}
          >
            <BsMortarboard className="h-14 w-14" />

            <div className="hidden w-full justify-center rounded-lg font-serif text-hmd group-hover:flex">
              Start learning {language.name} with this list
            </div>
          </Button>
        )}
        {userIsLearningListLanguage && (
          <Button
            className="duration-800 group hidden size-[72px] items-center justify-center rounded-lg bg-green-400 text-white shadow-2xl ring-white transition-all ease-in-out hover:w-[400px] hover:bg-green-400 hover:px-4 hover:text-white hover:ring-transparent desktop:flex"
            onClick={handleAddListToLearnedLists}
          >
            <BsMortarboard className="h-14 w-14" />

            <div className="hidden w-full justify-center rounded-lg font-serif text-hmd group-hover:flex">
              Start learning this list
            </div>
          </Button>
        )}
      </>
    );
}
