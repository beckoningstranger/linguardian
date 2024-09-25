"use client";

import { useActiveLanguage } from "@/context/ActiveLanguageContext";
import { addNewLanguageToLearn } from "@/lib/actions";
import paths from "@/lib/paths";
import { LanguageWithFlag, SessionUser } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Flag from "react-world-flags";
import Spinner from "./Spinner";
import CenteredSpinner from "./CenteredSpinner";

interface PickNewLanguageProps {
  languageAndFlag: LanguageWithFlag;
  languageName?: string;
}

export default function PickNewLanguage({
  languageAndFlag,
  languageName,
}: PickNewLanguageProps) {
  const router = useRouter();
  const { data, status, update } = useSession();
  const sessionUser = data?.user as SessionUser;

  const { setActiveLanguage } = useActiveLanguage();
  const [updating, setUpdating] = useState(false);

  const handleLanguageSelection = async () => {
    setUpdating(true);
    try {
      await toast.promise(
        addNewLanguageToLearn(sessionUser.id, languageAndFlag.name),
        {
          loading: "Adding a new language...",
          success: () => {
            return `You are now learning ${languageName}! 🎉`;
          },
          error: (err) => {
            return err.toString();
          },
        }
      );
      const updatedIsLearning = [...sessionUser.isLearning, languageAndFlag];
      update({
        ...data,
        user: { ...sessionUser, isLearning: updatedIsLearning },
      });
      console.log("Setting active language to", languageAndFlag.name);
      setActiveLanguage(languageAndFlag.name);
      router.push(paths.dashboardLanguagePath(languageAndFlag.name));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") return <CenteredSpinner />;

  return (
    <button
      key={languageAndFlag.name}
      onClick={handleLanguageSelection}
      disabled={updating}
    >
      <Flag
        code={languageAndFlag.flag}
        className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
      />
    </button>
  );
}
