"use client";

import { stopLearningLanguage } from "@/lib/actions";
import paths from "@/lib/paths";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import CenteredSpinner from "./CenteredSpinner";

interface StopLearningLanguageButtonProps {
  langName: string;
  langCode: string;
}

export default function StopLearningLanguageButton({
  langName,
  langCode,
}: StopLearningLanguageButtonProps) {
  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const sessionUser = data?.user as SessionUser;
  const router = useRouter();

  const handleStopLearningLanguage = async () => {
    setUpdating(true);
    try {
      toast.promise(stopLearningLanguage(langCode as SupportedLanguage), {
        loading: "Updating your learning settings...",
        success: `You are no longer learning ${langName}!`,
        error: (err) => {
          setUpdating(false);
          return err.toString();
        },
      });

      const updatedIsLearning = sessionUser?.isLearning.filter(
        (lwf) => lwf.name !== langCode
      );
      await update({
        ...data,
        user: {
          ...sessionUser,
          isLearning: updatedIsLearning,
          activeLanguageAndFlag: updatedIsLearning[0],
        },
      });

      router.push(paths.profilePath(sessionUser.usernameSlug));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") return <CenteredSpinner />;

  return (
    <button
      className="rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
      onClick={handleStopLearningLanguage}
      disabled={updating}
    >
      Stop learning {langName}
    </button>
  );
}
