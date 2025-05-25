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
//   return { title: listName };
// }

export const metadata: Metadata = {
  title: "Learn and Review",
};

// export async function generateStaticParams() {
//   const learningModes = siteSettings.learningModes;
//   const [listNumbers] = await Promise.all([getListNumbers()]);

//   return learningModes.flatMap((mode) =>
//     (listNumbers ?? []).map((number) => ({
//       mode: mode,
//       listNumberString: number,
//     }))
//   );
// }

interface ReviewPageProps {
  params: {
    mode: LearningMode;
    listNumberString: string;
  };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);

  const {
    targetLanguageFeatures,
    listName,
    allItemStringsInList,
    itemsToLearn,
  } = (await getLearningSessionForList(listNumber, mode)) as {
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
