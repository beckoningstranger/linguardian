import {
  getAllLearnedListsForUser,
  getLearningDataForList,
} from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";
import ChartsLButtonsLeaderboard from "./ChartsLearningButtonsLeaderBoard";
import StartLearningListButton from "./StartLearningListButton";

interface ListFlexibleContentProps {
  language: SupportedLanguage;
  listNumber: number;
}
export default async function ListFlexibleContent({
  language,
  listNumber,
}: ListFlexibleContentProps) {
  const sessionUser = await getUserOnServer();
  const listIsInLearnedLists: Record<SupportedLanguage, number[]> =
    await getAllLearnedListsForUser(sessionUser.id);

  if (!listIsInLearnedLists[language]?.includes(listNumber))
    return (
      <StartLearningListButton language={language} listNumber={listNumber} />
    );

  const [learningDataForList] = await Promise.all([
    getLearningDataForList(sessionUser.id, language, listNumber),
  ]);
  if (!learningDataForList)
    throw new Error("Failed to get learning data, please report this");
  const { learnedList, learnedItems, ignoredItems } = learningDataForList;
  return (
    <ChartsLButtonsLeaderboard
      ignoredItems={ignoredItems}
      learnedItems={learnedItems}
      list={learnedList}
    />
  );
}
