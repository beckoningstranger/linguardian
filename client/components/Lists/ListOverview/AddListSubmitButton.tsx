"use client";

import { SessionUser, SupportedLanguage } from "@/lib/types";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AddListSubmitButtonProps {
  children: ReactNode;
  language: SupportedLanguage;
  listNumber: number;
}

export default function AddListSubmitButton({
  children,
  language,
  listNumber,
}: AddListSubmitButtonProps) {
  const { data: session, update } = useSession();

  return (
    <button
      type="submit"
      onClick={() => {
        updateLearnedListsInSession(session?.user, language, listNumber);
        update(session);
      }}
    >
      {children}
    </button>
  );
}

function updateLearnedListsInSession(
  sessionUser: SessionUser,
  language: SupportedLanguage,
  listNumber: number
) {
  if (sessionUser.learnedLists[language]?.length) {
    sessionUser.learnedLists[language]?.push(listNumber);
  } else {
    Object.assign(sessionUser.learnedLists, { [language]: [listNumber] });
  }
}
