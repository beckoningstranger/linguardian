"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import {
  LanguageWithFlagAndName,
  SupportedLanguage,
} from "@linguardian/shared/contracts";
import { useUserUpdater } from "@/lib/hooks/useUserUpdater";

interface StopLearningLanguageButtonProps {
  language: LanguageWithFlagAndName;
}

export default function StopLearningLanguageButton({
  language,
}: StopLearningLanguageButtonProps) {
  const [updatingMap, setUpdatingMap] = useState<
    Map<SupportedLanguage, boolean>
  >(new Map());
  const { user } = useUser();
  const applyUserUpdate = useUserUpdater();

  if (!user) {
    toast.error("User not loaded in context.");
    return null;
  }

  const handleStopLearningLanguage = async () => {
    setUpdatingMap((prev) => new Map(prev).set(language.code, true));

    const learnedLanguages = user?.learnedLanguages
      ? user?.learnedLanguages.filter(
          (languageObject) => languageObject.code !== language.code
        )
      : [];

    const result = await toast.promise(
      applyUserUpdate({ id: user.id, learnedLanguages }),
      {
        loading: "Updating your learning settings...",
        success: `You are no longer learning ${language.name}!`,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );
    if (result)
      setUpdatingMap((prev) => new Map(prev).set(language.code, false));
  };

  return (
    <Button
      intent="danger"
      onClick={handleStopLearningLanguage}
      disabled={updatingMap.get(language.code)}
      className="h-20 rounded-md bg-white text-clgb text-red-500"
    >
      Stop learning {language.name}
    </Button>
  );
}
