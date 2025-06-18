import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import { getLearningSessionForList } from "@/lib/fetchData";
import { prepareItemsForSession } from "@/lib/helperFunctionsServer";
import { ItemFE, LanguageFeatures, LearningMode, User } from "@/lib/types";
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
    user,
  } = (await getLearningSessionForList(listNumber, mode, unitNumber)) as {
    targetLanguageFeatures: LanguageFeatures;
    listName: string;
    allItemStringsInList: string[];
    itemsToLearn: ItemFE[];
    user: User;
  };

  return (
    <>
      <div
        className={`absolute inset-0 -z-10 bg-cover bg-center`}
        style={{
          backgroundImage: `url("/backgrounds/DictionaryBackground.webp")`,
        }}
      />

      <LearnAndReview
        targetLanguageFeatures={targetLanguageFeatures}
        items={prepareItemsForSession(mode, itemsToLearn)}
        listName={listName}
        allItemStringsInList={allItemStringsInList}
        mode={mode}
        user={user}
        from={from}
      />
    </>
  );
}
