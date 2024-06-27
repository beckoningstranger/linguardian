"use client";
import { LanguageWithFlagAndName, SessionUser } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Spinner from "../Spinner";
import { finishOnboarding } from "@/lib/actions";

interface OnboardingSubmitButtonProps {
  userNative: LanguageWithFlagAndName | null;
  languageToLearn: LanguageWithFlagAndName | null;
}

export default function OnboardingSubmitButton({
  userNative,
  languageToLearn,
}: OnboardingSubmitButtonProps) {
  const { data: session, update } = useSession();
  const [updating, setUpdating] = useState<boolean>(false);

  const finishOnboardingAction = finishOnboarding.bind(null, {
    userNative: userNative?.name,
    languageToLearn: languageToLearn?.name,
  });

  return (
    <button
      type="submit"
      className="flex h-16 w-full items-center px-6 py-3 text-center disabled:cursor-not-allowed"
      onClick={() => {
        updateSession();
        finishOnboardingAction();
      }}
      disabled={updating}
    >
      {updating ? (
        <span className="flex w-full justify-center">
          <Spinner size="mini" />
        </span>
      ) : (
        <span className="w-full text-center">
          Start learning by picking a list
        </span>
      )}
    </button>
  );

  function updateSession() {
    setUpdating(true);
    const sessionUser: SessionUser = session?.user;
    sessionUser.native = {
      name: userNative?.name!,
      flag: userNative?.flag!,
    };
    sessionUser.isLearning = [
      {
        name: languageToLearn?.name!,
        flag: languageToLearn?.flag!,
      },
    ];
    update(session);
  }
}
