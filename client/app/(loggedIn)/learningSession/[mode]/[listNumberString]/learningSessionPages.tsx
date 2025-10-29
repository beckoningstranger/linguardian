// app/(learn)/learn/_server/learningSession.shared.ts
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { fetchLearningSessionData } from "@/lib/api/bff-api";
import { BackgroundPicture, LearnAndReview } from "@/components";
import type { LearningMode } from "@/lib/contracts";
import type { SearchParams } from "@/lib/types";
import { parseFrom, parseOverstudy } from "@/lib/utils/pages";

export const revalidate = 0;
export const dynamic = "force-dynamic" as const;
export const fetchCache = "default-no-store" as const;

const getLearningSession = cache(fetchLearningSessionData);

export async function generateListMetadata(args: {
  mode: LearningMode;
  listNumber: number;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const overstudy = (() => {
    try {
      return parseOverstudy(args.searchParams);
    } catch {
      return false;
    }
  })();

  try {
    const res = await getLearningSession({
      listNumber: args.listNumber,
      mode: args.mode,
      overstudy,
    });
    if (!res.success) return { title: "Learning session" };

    const verb = args.mode === "learn" ? "New words from" : "Reviewing";
    return { title: `${verb} ${res.data.listName}` };
  } catch {
    return { title: "Learning session" };
  }
}

export async function generateUnitMetadata(args: {
  mode: LearningMode;
  listNumber: number;
  unitNumber: number;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const overstudy = (() => {
    try {
      return parseOverstudy(args.searchParams);
    } catch {
      return false;
    }
  })();

  try {
    const res = await getLearningSession({
      listNumber: args.listNumber,
      unitNumber: args.unitNumber,
      mode: args.mode,
      overstudy,
    });
    if (!res.success) return { title: "Learning session" };

    const verb = args.mode === "learn" ? "New words from" : "Reviewing";
    return { title: `${verb} ${res.data.listName}` };
  } catch {
    return { title: "Learning session" };
  }
}

export async function renderListPage(args: {
  mode: LearningMode;
  listNumber: number;
  searchParams: SearchParams;
}) {
  const overstudy = parseOverstudy(args.searchParams);
  const from = parseFrom(args.searchParams);

  const response = await fetchLearningSessionData({
    listNumber: args.listNumber,
    mode: args.mode,
    overstudy,
  });
  if (!response.success) notFound();

  const { targetLanguageFeatures, listName, possibleAnswers, items } =
    response.data;

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPicture bgPicture="/backgrounds/DictionaryBackground.webp" />
      <div className="flex grow flex-col overflow-y-auto">
        <LearnAndReview
          targetLanguageFeatures={targetLanguageFeatures}
          items={items}
          listName={listName}
          allItemStringsInList={possibleAnswers}
          mode={args.mode}
          from={from}
        />
      </div>
    </div>
  );
}

export async function renderUnitPage(args: {
  mode: LearningMode;
  listNumber: number;
  unitNumber: number;
  searchParams: SearchParams;
}) {
  const overstudy = parseOverstudy(args.searchParams);
  const from = parseFrom(args.searchParams);

  const response = await fetchLearningSessionData({
    listNumber: args.listNumber,
    unitNumber: args.unitNumber,
    mode: args.mode,
    overstudy,
  });
  if (!response.success) notFound();

  const { targetLanguageFeatures, listName, possibleAnswers, items } =
    response.data;

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPicture bgPicture="/backgrounds/DictionaryBackground.webp" />
      <div className="flex grow flex-col overflow-y-auto">
        <LearnAndReview
          targetLanguageFeatures={targetLanguageFeatures}
          items={items}
          listName={listName}
          allItemStringsInList={possibleAnswers}
          mode={args.mode}
          from={from}
        />
      </div>
    </div>
  );
}
