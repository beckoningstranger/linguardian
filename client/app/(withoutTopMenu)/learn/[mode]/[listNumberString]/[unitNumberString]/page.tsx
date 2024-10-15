import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import { getLearningSessionForList, getListName } from "@/lib/fetchData";
import { prepareItemsForSession } from "@/lib/helperFunctionsServer";
import {
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  LearningMode,
} from "@/lib/types";

export async function generateMetadata({ params }: ReviewPageProps) {
  const listNumber = parseInt(params.listNumberString);
  const listName = await getListName(listNumber);
  return { title: `${listName} - Unit ${params.unitNumberString}` };
}

interface ReviewPageProps {
  params: {
    mode: LearningMode;
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString, unitNumberString },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);

  const {
    targetLanguageFeatures,
    listName,
    allItemStringsInList,
    itemsToLearn,
  } = (await getLearningSessionForList(listNumber, mode, unitNumber)) as {
    targetLanguageFeatures: LanguageFeatures;
    listName: string;
    allItemStringsInList: string[];
    itemsToLearn: ItemWithPopulatedTranslations[];
  };

  return (
    <LearnAndReview
      targetLanguageFeatures={targetLanguageFeatures}
      items={prepareItemsForSession(mode, itemsToLearn)}
      listName={listName}
      allItemStringsInList={allItemStringsInList}
      mode={mode}
    />
  );
}
