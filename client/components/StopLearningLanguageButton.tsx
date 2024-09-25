"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { stopLearningLanguage } from "@/lib/actions";
import paths from "@/lib/paths";
import { SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import CenteredSpinner from "./CenteredSpinner";

interface StopLearningLanguageButtonProps {
  langName: string;
  langCode: string;
}

export default function StopLearningLanguageButton({
  langName,
  langCode,
}: StopLearningLanguageButtonProps) {
  const router = useRouter();
  const { setActiveLanguage } = useActiveLanguage();
  const [updating, setUpdating] = useState(false);
  const { data, status, update } = useSession();
  const sessionUser = data?.user as SessionUser;

  const handleClick = () => {
    setUpdating(true);
    toast.promise(stopLearningLanguage(langCode as SupportedLanguage), {
      loading: "Updating your learning settings...",
      success: () => {
        const updatedIsLearning = sessionUser?.isLearning.filter(
          (lwf) => lwf.name !== langCode
        );
        if (sessionUser && updatedIsLearning) {
          update({
            ...data,
            user: { ...sessionUser, isLearning: updatedIsLearning },
          });
          setActiveLanguage(updatedIsLearning[0]?.name);
        }
        router.push(paths.profilePath(sessionUser.usernameSlug));
        setUpdating(false);
        return `You are no longer learning ${langName}!`;
      },
      error: (err) => {
        setUpdating(false);
        return err.toString();
      },
    });
  };

  if (status === "loading") return <CenteredSpinner />;

  return (
    <button
      className="rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
      onClick={handleClick}
      disabled={updating}
    >
      Stop learning {langName}
    </button>
  );
}
