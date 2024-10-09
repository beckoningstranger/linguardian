"use client";
import { setLearnedLanguages, setNativeLanguage } from "@/lib/actions";
import { LanguageWithFlagAndName, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import paths from "@/lib/paths";

interface OnboardingSubmitButtonProps {
  userNative: LanguageWithFlagAndName;
  languageToLearn: LanguageWithFlagAndName;
}

export default function OnboardingSubmitButton({
  userNative,
  languageToLearn,
}: OnboardingSubmitButtonProps) {
  const router = useRouter();
  const { data, status, update } = useSession();
  const user: User = data?.user;
  const [updating, setUpdating] = useState<boolean>(false);

  if (status === "loading") return <Spinner centered />;
  return (
    <button
      type="submit"
      className="flex h-16 w-full items-center px-6 py-3 text-center disabled:cursor-not-allowed"
      onClick={async () => {
        setUpdating(true);
        try {
          await toast.promise(setNativeLanguage(userNative), {
            loading: "Setting your native language...",
            success: () => {
              return `Your native language is ${userNative.name}! 🎉`;
            },
            error: (err) => {
              return err.toString();
            },
          });

          await toast.promise(setLearnedLanguages([languageToLearn]), {
            loading: "Updating your learning settings...",
            success: `You are now learning ${languageToLearn.name}! 🎉`,
            error: (err) => {
              return err.toString();
            },
          });

          await update({
            ...data,
            user: {
              ...user,
              native: userNative,
              learnedLanguages: [languageToLearn],
              activeLanguageAndFlag: languageToLearn,
            },
          });
          router.push(paths.dashboardLanguagePath(languageToLearn.code));
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
