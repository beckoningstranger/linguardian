"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Spinner from "@/components/Spinner";
import { useUser } from "@/context/UserContext";
import {
  LanguageWithFlagAndName,
  updateUserSchema,
} from "@linguardian/shared/contracts";
import { useUserUpdater } from "@/lib/hooks/useUserUpdater";
import paths from "@/lib/paths";
import { defaultSRSettings } from "@linguardian/shared/constants";

interface OnboardingSubmitButtonProps {
  languageToLearn: LanguageWithFlagAndName;
  userNative: LanguageWithFlagAndName;
}

export default function OnboardingSubmitButton({
  languageToLearn,
  userNative,
}: OnboardingSubmitButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const applyUserUpdate = useUserUpdater();
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("User not loaded in context.");
      return;
    }

    const draftUser = {
      id: user.id,
      native: userNative,
      learnedLanguages: [languageToLearn],
      completedOnboarding: true,
      learnedLists: { [languageToLearn.code]: [] },
      learnedItems: { [languageToLearn.code]: [] },
      ignoredItems: { [languageToLearn.code]: [] },
      activeLanguageAndFlag: languageToLearn,
      customSRSettings: {
        [languageToLearn.code]: defaultSRSettings,
      },
    };

    const result = updateUserSchema.safeParse(draftUser);
    if (!result.success) {
      toast.error("Could not validate user update, please report this.");
      return;
    }

    setUpdating(true);

    const response = await toast.promise(applyUserUpdate(result.data), {
      loading: "Updating...",
      success: "User data updated!",
      error: (err) => (err instanceof Error ? err.message : err.toString()),
    });

    setUpdating(false);

    if (response) router.push(paths.listStorePath(languageToLearn.code));
  };

  return (
    <Button
      intent="primary"
      type="submit"
      className="flex h-16 w-full items-center px-6 py-3 text-center disabled:cursor-not-allowed"
      onClick={handleSubmit}
      disabled={updating}
    >
      {updating ? (
        <span className="flex w-full justify-center">
          <Spinner mini />
        </span>
      ) : (
        <span className="w-full text-center">
          Start learning by picking a list
        </span>
      )}
    </Button>
  );
}
