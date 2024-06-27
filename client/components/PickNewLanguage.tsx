"use client";

import { addNewLanguageToLearn } from "@/lib/actions";
import { LanguageWithFlag } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Flag from "react-world-flags";

interface PickNewLanguageProps {
  languagesAndFlag: LanguageWithFlag;
}

export default function PickNewLanguage({
  languagesAndFlag,
}: PickNewLanguageProps) {
  const { data: session, update } = useSession();
  const [updating, setUpdating] = useState(false);
  if (!session) throw new Error("No session found. Are you logged in?");

  const addNewLanguageToLearnAction = addNewLanguageToLearn.bind(
    null,
    session.user.id,
    languagesAndFlag.name
  );

  return (
    <button
      key={languagesAndFlag.name}
      onClick={() => {
        setUpdating(true);
        if (!session.user.isLearning) session.user.isLearning = [];
        session?.user.isLearning.push(languagesAndFlag);
        update(session);
        addNewLanguageToLearnAction();
      }}
      disabled={updating}
    >
      <Flag
        code={languagesAndFlag.flag}
        className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
      />
    </button>
  );
}
