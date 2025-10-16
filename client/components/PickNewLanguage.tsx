"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Flag from "react-world-flags";

import { useUser } from "@/context/UserContext";
import { useUserUpdater } from "@/lib/hooks/useUserUpdater";
import paths from "@/lib/paths";
import { LanguageWithFlagAndName } from "@/lib/contracts";
import Button from "@/components/ui/Button";

interface PickNewLanguageProps {
  newLanguage: LanguageWithFlagAndName;
}

export default function PickNewLanguage({ newLanguage }: PickNewLanguageProps) {
  const [updating, setUpdating] = useState(false);
  const { user } = useUser();
  const applyUserUpdate = useUserUpdater();
  const router = useRouter();

  if (!user) {
    toast.error("User not loaded in context.");
    return null;
  }

  const handleLanguageSelection = async () => {
    if (updating) return;
    const learnedLanguages = user?.learnedLanguages
      ? [...user.learnedLanguages, newLanguage]
      : [newLanguage];

    setUpdating(true);

    const result = await toast.promise(
      applyUserUpdate({ id: user.id, learnedLanguages }),
      {
        loading: "Adding a new language...",
        success: () => `You are now learning ${newLanguage.name}! 🎉`,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );

    if (result) router.push(paths.dashboardLanguagePath(newLanguage.code));

    setUpdating(false);
  };

  return (
    <Button onClick={handleLanguageSelection} disabled={updating}>
      <Flag
        code={newLanguage.flag}
        className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-110`}
      />
    </Button>
  );
}
