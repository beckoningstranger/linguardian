import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import { getLearningSessionForList } from "@/lib/fetchData";
import { prepareItemsForSession } from "@/lib/helperFunctionsServer";
import {
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  LearningMode,
} from "@/lib/types";
import { Metadata } from "next";

// export async function generateMetadata({ params }: ReviewPageProps) {
//   const listNumber = parseInt(params.listNumberString);
//   const listName = await getListName(listNumber);
//   return { title: `${listName} - Unit ${params.unitNumberString}` };
// }

export const metadata: Metadata = {
  title: "Learn and Review",
};

interface ReviewPageProps {
  params: {
    mode: LearningMode;
    listNumberString: string;
    unitNumberString: string;
  };
  searchParams: { from: "dashboard" | number };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString, unitNumberString },
  searchParams: { from },
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
      from={from}
    />
  );
}
