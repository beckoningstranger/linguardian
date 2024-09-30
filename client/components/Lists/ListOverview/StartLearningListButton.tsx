"use client";
import Spinner from "@/components/Spinner";
import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { addListToDashboard, addNewLanguageToLearn } from "@/lib/actions";
import { PopulatedList, SessionUser } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StartLearningListButtonProps {
  languageName: string | undefined;
  list: PopulatedList;
}

export default function StartLearningListButton({
  list,
  languageName,
}: StartLearningListButtonProps) {
  const [updating, setUpdating] = useState(false);
  const { language, flag, listNumber, name } = list;
  const { data, status, update } = useSession();
  const sessionUser = data?.user as SessionUser;
  const { setActiveLanguage } = useActiveLanguage();
  let userIsLearningThisLanguage = false;

  if (sessionUser)
    sessionUser.isLearning.forEach((lang) => {
      if (lang.name === language) userIsLearningThisLanguage = true;
    });

  const addListToDashboardAction = async () => {
    setUpdating(true);
    await toast.promise(
      addListToDashboard(listNumber, language, sessionUser.id),
      {
        loading: `Adding "${name}" to your lists...`,
        success: `"${name}" has been added to your lists! 🎉`,
        error: (err) => err.toString(),
      }
    );

    const updatedLearnedLists = { ...sessionUser.learnedLists };
    if (updatedLearnedLists[language]?.length) {
      updatedLearnedLists[language]?.push(listNumber);
    } else {
      updatedLearnedLists[language] = [listNumber];
    }
    update({ ...data, user: { learnedLists: updatedLearnedLists } });
    setUpdating(false);
  };

  const startLearningLanguageAndList = async () => {
    await toast.promise(addNewLanguageToLearn(sessionUser.id, language), {
      loading: `Adding ${languageName} to your languages...`,
      success: `You are now learning ${languageName}! 🎉`,
      error: (err) => err.toString(),
    });

    const updatedIsLearning = [
      ...sessionUser.isLearning,
      {
        flag,
        name: language,
      },
    ];

    update({
      ...data,
      user: {
        ...sessionUser,
        updatedIsLearning,
        activeLanguageAndFlag: { name: language, flag },
      },
    });
    setActiveLanguage({ name: language, flag });
    await addListToDashboardAction();
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <>
      {!userIsLearningThisLanguage && (
        <button
          onClick={startLearningLanguageAndList}
          disabled={updating}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          Start learning {languageName} with this list!
        </button>
      )}
      {userIsLearningThisLanguage && (
        <button
          onClick={addListToDashboardAction}
          disabled={updating}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          Start learning this list
        </button>
      )}
    </>
  );
}
