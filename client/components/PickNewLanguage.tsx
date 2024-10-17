"use client";

import { setLearnedLanguages } from "@/lib/actions";
import paths from "@/lib/paths";
import { LanguageWithFlagAndName, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Flag from "react-world-flags";
import Spinner from "./Spinner";
import { Button } from "@headlessui/react";

interface PickNewLanguageProps {
  newLanguage: LanguageWithFlagAndName;
}

export default function PickNewLanguage({ newLanguage }: PickNewLanguageProps) {
  const { data, status, update } = useSession();
  const user = data?.user as User;
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleLanguageSelection = async () => {
    setUpdating(true);
    const newLearnedLanguages = user.learnedLanguages
      ? [...user.learnedLanguages, newLanguage]
      : [newLanguage];
    try {
      toast.promise(setLearnedLanguages(newLearnedLanguages), {
        loading: "Adding a new language...",
        success: `You are now learning ${newLanguage.name}! 🎉`,
        error: (err) => {
          return err.toString();
        },
      });

      await update({
        ...data,
        user: {
          ...user,
          learnedLanguages: newLearnedLanguages,
          activeLanguageAndFlag: newLanguage,
        },
      });
      router.push(paths.dashboardLanguagePath(newLanguage.code));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") return <Spinner centered />;

  return (
    <Button
      key={newLanguage.code}
      onClick={handleLanguageSelection}
      disabled={updating}
    >
      <Flag
        code={newLanguage.flag}
        className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
      />
    </Button>
  );
}
