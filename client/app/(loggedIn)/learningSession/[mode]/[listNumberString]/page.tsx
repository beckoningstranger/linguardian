import { notFound } from "next/navigation";

import { BackgroundPicture, LearnAndReview } from "@/components";
import { fetchLearningSessionData } from "@/lib/api/bff-api";
import { LearningMode } from "@/lib/contracts";

export async function generateMetadata({
  params: { listNumberString, mode },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);
  const response = await fetchLearningSessionData({ listNumber, mode });

  if (!response.success) throw new Error("Could not get learning session data");
  const { listName } = response.data;
  const learningVerb = mode === "learn" ? "New words from" : "Reviewing";
  return { title: `${learningVerb} ${listName}` };
}

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

  const response = await fetchLearningSessionData({ listNumber, mode });
  if (!response.success) notFound();

  const { targetLanguageFeatures, listName, allItemStringsInList, items } =
    response.data;

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPicture bgPicture="/backgrounds/DictionaryBackground.webp" />
      <div className="flex grow flex-col overflow-y-auto">
        <LearnAndReview
          targetLanguageFeatures={targetLanguageFeatures}
          items={items}
          listName={listName}
          allItemStringsInList={allItemStringsInList}
          mode={mode}
          from={from}
        />
      </div>
    </div>
  );
}
