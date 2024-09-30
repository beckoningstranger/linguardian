"use client";
import { addNewLanguageToLearn, finishOnboarding } from "@/lib/actions";
import { LanguageWithFlagAndName, SessionUser } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

interface OnboardingSubmitButtonProps {
  userNative: LanguageWithFlagAndName;
  languageToLearn: LanguageWithFlagAndName;
}

export default function OnboardingSubmitButton({
  userNative,
  languageToLearn,
}: OnboardingSubmitButtonProps) {
  const { data, status, update } = useSession();
  const sessionUser: SessionUser = data?.user;
  const [updating, setUpdating] = useState<boolean>(false);

  if (status === "loading") return <Spinner centered />;
  return (
    <button
      type="submit"
      className="flex h-16 w-full items-center px-6 py-3 text-center disabled:cursor-not-allowed"
      onClick={async () => {
        setUpdating(true);
        try {
          await toast.promise(
            finishOnboarding(userNative.name, languageToLearn.name),
            {
              loading: "Your account is being created...",
              success: () => {
                return "Account created! 🎉";
              },
              error: (err) => {
                return err.toString();
              },
            }
          );

          await toast.promise(
            addNewLanguageToLearn(sessionUser.id, languageToLearn.name),
            {
              loading: "Updating your learning settings...",
              success: `You are now learning ${languageToLearn.langName}! 🎉`,
              error: (err) => {
                return err.toString();
              },
            }
          );

          await update({
            ...data,
            user: {
              ...sessionUser,
              native: userNative,
              isLearning: [languageToLearn],
              activeLanguageAndFlag: languageToLearn,
            },
          });
        } catch (err) {
          console.error("There was an error during registration: ", err);
        } finally {
          setUpdating(false);
        }
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
}
