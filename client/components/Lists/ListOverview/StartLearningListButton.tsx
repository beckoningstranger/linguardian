import { addListForNewLanguage, addListToDashboard } from "@/lib/actions";
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
  const addListToDashboardAction = addListToDashboard.bind(
    null,
    listNumber,
    language,
    userId
  );

  const addListForNewLanguageAction = addListForNewLanguage.bind(
    null,
    userId,
    language,
    listNumber
  );

  return (
    <>
      {!learnedLanguageData && (
        <form
          action={addListForNewLanguageAction}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          <button type="submit">
            Start learning {languageName} with this list!
          </button>
        </form>
      )}
      {learnedLanguageData &&
        userIsNotAlreadyLearningThisList(learnedLanguageData, listNumber) && (
          <>
            <form
              action={addListToDashboardAction}
              className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
            >
              <button>Start learning this list</button>
            </form>
          </>
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
