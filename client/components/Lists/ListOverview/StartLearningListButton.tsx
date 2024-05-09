import Link from "next/link";

import { LearnedLanguageWithPopulatedLists, SupportedLanguage } from "@/types";

interface StartLearningListButtonProps {
  learnedLanguageData?: LearnedLanguageWithPopulatedLists;
  language: SupportedLanguage;
  userId: string;
  listNumber: number;
  languageName: string;
}

export default function StartLearningListButton({
  learnedLanguageData,
  language,
  userId,
  listNumber,
  languageName,
}: StartLearningListButtonProps) {
  return (
    <>
      {!learnedLanguageData && (
        <Link
          href={`/lists/add?lang=${language}&user=${userId}&list=${listNumber}&newLanguage=yes`}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          Start learning {languageName} with this list!
        </Link>
      )}
      {learnedLanguageData &&
        userIsNotAlreadyLearningThisList(learnedLanguageData, listNumber) && (
          <Link
            href={`/lists/add?lang=${language}&user=${userId}&list=${listNumber}`}
            className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
          >
            Add this list to your dashboard
          </Link>
        )}
    </>
  );
}

function userIsNotAlreadyLearningThisList(
  learnedLanguageData: LearnedLanguageWithPopulatedLists | undefined,
  listNumber: number
) {
  if (learnedLanguageData) {
    const allListNumberssLearnedByUser: number[] =
      learnedLanguageData.learnedLists.map((list) => list.listNumber);
    if (allListNumberssLearnedByUser.includes(listNumber)) return false;
  }

  return true;
}
