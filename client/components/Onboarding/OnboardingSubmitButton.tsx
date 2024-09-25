"use client";
import { LanguageWithFlagAndName, SessionUser } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Spinner from "../Spinner";
import { addNewLanguageToLearn, finishOnboarding } from "@/lib/actions";
import toast from "react-hot-toast";
import CenteredSpinner from "../CenteredSpinner";

interface OnboardingSubmitButtonProps {
  userNative: LanguageWithFlagAndName;
  languageToLearn: LanguageWithFlagAndName;
}

export default function OnboardingSubmitButton({
  userNative,
  languageToLearn,
}: OnboardingSubmitButtonProps) {
  const { data: session, status, update } = useSession();
  const [updating, setUpdating] = useState<boolean>(false);

  if (status === "loading") return <CenteredSpinner />;
  return (
    <button
      type="submit"
      className="flex h-16 w-full items-center px-6 py-3 text-center disabled:cursor-not-allowed"
      onClick={() => {
        toast
          .promise(finishOnboarding(userNative.name, languageToLearn.name), {
            loading: "Your account is being created...",
            success: () => {
              updateSession();
              return "Account created! 🎉";
            },
            error: (err) => {
              return err.toString();
            },
          })
          .then(() =>
            toast.promise(
              addNewLanguageToLearn(session?.user.id, languageToLearn.name),
              {
                loading: "Updating your learning settings...",
                success: () => {
                  updateSession();
                  return `You are now learning ${languageToLearn.langName}! 🎉`;
                },
                error: (err) => {
                  return err.toString();
                },
              }
            )
          );
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
      name: userNative?.name,
      flag: userNative?.flag,
    };
    sessionUser.isLearning = [
      {
        name: languageToLearn?.name,
        flag: languageToLearn?.flag,
      },
    ];
    update(session);
  }
}
