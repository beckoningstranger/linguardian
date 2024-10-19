"use client";

import { setLearnedLanguages } from "@/lib/actions";
import { LanguageWithFlagAndName, SupportedLanguage, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Button from "./ui/Button";

interface StopLearningLanguageButtonProps {
  language: LanguageWithFlagAndName;
}

export default function StopLearningLanguageButton({
  language,
}: StopLearningLanguageButtonProps) {
  const [updatingMap, setUpdatingMap] = useState<
    Map<SupportedLanguage, boolean>
  >(new Map());
  const { data, status, update } = useSession();
  const user = data?.user as User;

  console.log(updatingMap);
  const handleStopLearningLanguage = async () => {
    setUpdatingMap((prev) => new Map(prev).set(language.code, true));
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
      setUpdatingMap((prev) => new Map(prev).set(language.code, false));
    }
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <Button
      intent="danger"
      onClick={handleStopLearningLanguage}
      disabled={updatingMap.get(language.code)}
    >
      Stop learning {language.name}
    </Button>
  );
}
