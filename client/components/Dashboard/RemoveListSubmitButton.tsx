"use client";

import { SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";

interface RemoveListSubmitButtonProps {
  language: SupportedLanguage;
  listNumber: number;
}

export default function RemoveListSubmitButton({
  language,
  listNumber,
}: RemoveListSubmitButtonProps) {
  const { data: session, update } = useSession();

  return (
    <button
      type="submit"
      onClick={() => {
        const indexOfNumberToRemove =
          session?.user.learnedLists[language].indexOf(listNumber);
        session?.user.learnedLists[language].splice(indexOfNumberToRemove, 1);
        update(session);
      }}
    >
      Remove list & Stop learning
    </button>
  );
}
