import BackgroundPicture from "@/components/BackgroundPicture";
import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import { getLearningSessionForList } from "@/lib/fetchData";
import { prepareItemsForSession } from "@/lib/helperFunctionsServer";
import { ItemFE, LanguageFeatures, LearningMode, User } from "@/lib/types";
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
  searchParams: { from: "dashboard" | number };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString },
  searchParams: { from },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);

  const {
    targetLanguageFeatures,
    listName,
    allItemStringsInList,
    itemsToLearn,
    user,
  } = (await getLearningSessionForList(listNumber, mode)) as {
    targetLanguageFeatures: LanguageFeatures;
    listName: string;
    allItemStringsInList: string[];
    itemsToLearn: ItemFE[];
    user: User;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPicture bgPicture="/backgrounds/DictionaryBackground.webp" />
      <div className="flex grow flex-col overflow-y-auto">
        <LearnAndReview
          targetLanguageFeatures={targetLanguageFeatures}
          items={prepareItemsForSession(mode, itemsToLearn)}
          listName={listName}
          allItemStringsInList={allItemStringsInList}
          mode={mode}
          user={user}
          from={from}
        />
      </div>
    </div>
  );
}
