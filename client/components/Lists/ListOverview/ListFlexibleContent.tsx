import {
  getAllLearnedListsForUser,
  getLanguageFeaturesForLanguage,
  getLearningDataForList,
} from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctions";
import { PopulatedList, SupportedLanguage } from "@/lib/types";
import ChartsLButtonsLeaderboard from "./ChartsLearningButtonsLeaderBoard";
import StartLearningListButton from "./StartLearningListButton";

interface ListFlexibleContentProps {
  language: SupportedLanguage;
  list: PopulatedList;
}
export default async function ListFlexibleContent({
  language,
  list,
}: ListFlexibleContentProps) {
  const [sessionUser, languageFeatures] = await Promise.all([
    getUserOnServer(),
    getLanguageFeaturesForLanguage(language),
  ]);
  const listIsInLearnedLists: Record<SupportedLanguage, number[]> =
    await getAllLearnedListsForUser(sessionUser.id);

  if (!listIsInLearnedLists[language]?.includes(list.listNumber))
    return (
      <StartLearningListButton
        list={list}
        languageName={languageFeatures?.langName}
      />
    );

  const [learningDataForList] = await Promise.all([
    getLearningDataForList(sessionUser.id, language, list.listNumber),
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
