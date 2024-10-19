"use client";
import Spinner from "@/components/Spinner";
import Button from "@/components/ui/Button";
import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { useListContext } from "@/context/ListContext";
import { setLearnedLanguages, setLearnedLists } from "@/lib/actions";
import { User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StartLearningListButtonProps {}

export default function StartLearningListButton({}: StartLearningListButtonProps) {
  const {
    listData: { language: listLanguage, listNumber, name },
  } = useListContext();

  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const user = data?.user as User;
  const { setActiveLanguage } = useActiveLanguage();
  let userIsLearningThisLanguage = false;

  if (user && user.learnedLanguages)
    user.learnedLanguages.forEach((lang) => {
      if (lang.code === listLanguage.code) userIsLearningThisLanguage = true;
    });

  const addListToLearnedListsAction = async () => {
    setUpdating(true);

    const updatedLearnedLists = {
      ...user.learnedLists,
      [listLanguage.code]: Array.from(
        new Set(
          [...(user.learnedLists[listLanguage.code] ?? []), listNumber].flat()
        )
      ),
    };

    await toast.promise(
      setLearnedLists(listNumber, updatedLearnedLists, listLanguage.code),
      {
        loading: `Adding "${name}" to your learned lists...`,
        success: () => {
          return `"${name}" has been added to your learned lists! 🎉`;
        },
        error: (err) => err.toString(),
      }
    );

    await update({ ...data, user: { learnedLists: updatedLearnedLists } });
    setUpdating(false);
  };

  const startLearningLanguageAndList = async () => {
    const updatedIsLearning = user.learnedLanguages
      ? [...user.learnedLanguages, listLanguage]
      : [listLanguage];
    await toast.promise(setLearnedLanguages(updatedIsLearning), {
      loading: `Adding ${listLanguage.name} to your languages...`,
      success: `You are now learning ${listLanguage.name}! 🎉`,
      error: (err) => err.toString(),
    });

    await update({
      ...data,
      user: {
        ...user,
        updatedIsLearning,
        activeLanguageAndFlag: listLanguage,
      },
    });
    setActiveLanguage(listLanguage);
    await addListToLearnedListsAction();
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <>
      {!userIsLearningThisLanguage && (
        <Button
          intent="primary"
          onClick={startLearningLanguageAndList}
          disabled={updating}
          className="mx-2 p-4"
        >
          Start learning {listLanguage.name} with this list!
        </Button>
      )}
      {userIsLearningThisLanguage && (
        <Button
          intent="primary"
          onClick={addListToLearnedListsAction}
          disabled={updating}
          className="mx-2 p-4"
        >
          Start learning this list
        </Button>
      )}
    </>
  );
}
