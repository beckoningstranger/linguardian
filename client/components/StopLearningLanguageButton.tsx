"use client";

import { setLearnedLanguages } from "@/lib/actions";
import { LanguageWithFlagAndName, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface StopLearningLanguageButtonProps {
  language: LanguageWithFlagAndName;
}

export default function StopLearningLanguageButton({
  language,
}: StopLearningLanguageButtonProps) {
  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const user = data?.user as User;
  const router = useRouter();

  const handleStopLearningLanguage = async () => {
    setUpdating(true);
    const updatedLearnedLanguages = user.learnedLanguages
      ? user?.learnedLanguages.filter(
          (languageObject) => languageObject.code !== language.code
        )
      : [];

    try {
      toast.promise(setLearnedLanguages(updatedLearnedLanguages), {
        loading: "Updating your learning settings...",
        success: `You are no longer learning ${language.name}!`,
        error: (err) => err.toString(),
      });

      await update({
        ...data,
        user: {
          ...user,
          learnedLanguages: updatedLearnedLanguages,
          activeLanguageAndFlag: updatedLearnedLanguages[0],
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <button
      className="rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
      onClick={handleStopLearningLanguage}
      disabled={updating}
    >
      Stop learning {language.name}
    </button>
  );
}
