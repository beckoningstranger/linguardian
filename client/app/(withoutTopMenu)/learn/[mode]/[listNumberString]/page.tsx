import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import NavigateBackButton from "@/components/NavigateBackButton";
import { getLearningSessionForList } from "@/lib/fetchData";
import { prepareItemsForSession } from "@/lib/helperFunctionsServer";
import {
  FullyPopulatedList,
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  LearningMode,
  SupportedLanguage,
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
//   const [learningModes, listNumbers] = await Promise.all([
//     getLearningModes(),
//     getListNumbers(),
//   ]);

//   return (learningModes ?? []).flatMap((mode) =>
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

function checkIfModeIsUnlockedOrAbort(
  mode: LearningMode,
  userNative: SupportedLanguage,
  listData: FullyPopulatedList
) {
  if (
    mode !== "learn" && // Need to push 'learn' to unlocked modes
    !listData.unlockedReviewModes[userNative].includes(mode)
  )
    return (
      <div className="grid h-screen place-items-center">
        <div className="flex flex-col items-center">
          <h1 className="mb-5 text-center text-2xl">
            Sorry, we could not create a learning session!
          </h1>
          <p>
            No valid learning mode selected. Mode &apos;{mode}&apos; either does
            not exist or has not been unlocked for this list.
          </p>
          <NavigateBackButton />
        </div>
      </div>
    );
}
