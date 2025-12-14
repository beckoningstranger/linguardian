import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BackgroundPicture from "@/components/Layout/BackgroundPicture";
import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import { fetchLearningSessionForLanguageData } from "@/lib/api/bff-api";
import type { LearningMode } from "@linguardian/shared/contracts";
import { allLanguageFeatures } from "@linguardian/shared/constants";
import type { SearchParams } from "@/lib/types";
import {
  parseFrom,
  parseLanguageCode,
  parseLearningMode,
  parseOverstudy,
} from "@/lib/utils/pages";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

interface Props {
  params: Promise<{ mode: LearningMode; langCode: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const languageFeatures = allLanguageFeatures.find(
    (lang) => lang.langCode === params.langCode
  );
  if (!languageFeatures) return { title: "Reviewing" };

  return { title: `Reviewing ${languageFeatures.langName}` };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const overstudy = parseOverstudy(searchParams);
  const from = parseFrom(searchParams);
  const mode = parseLearningMode(params.mode);
  const langCode = parseLanguageCode(params.langCode);

  const languageFeatures = allLanguageFeatures.find(
    (lang) => lang.langCode === langCode
  );

  const response = await fetchLearningSessionForLanguageData({
    langCode,
    mode,
    overstudy,
  });
  if (!response.success) notFound();

  const { targetLanguageFeatures, possibleAnswers, items } = response.data;

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPicture bgPicture="/backgrounds/DictionaryBackground.webp" />
      <div className="flex grow flex-col overflow-y-auto">
        <LearnAndReview
          targetLanguageFeatures={targetLanguageFeatures}
          items={items}
          listName={`Reviewing ${languageFeatures?.langName}...`}
          allItemStringsInList={possibleAnswers}
          mode={mode}
          from={from}
          overstudy={overstudy}
        />
      </div>
    </div>
  );
}
