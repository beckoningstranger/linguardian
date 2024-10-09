"use client";

import ReviewButton from "@/components/ReviewButton";
import { useListContext } from "@/context/ListContext";

interface AllLearningButtonsProps {}

export default function AllLearningButtons({}: AllLearningButtonsProps) {
  const {
    listData: { listNumber, language },
    listStats,
    unlockedLearningModesForUser,
  } = useListContext();
  return (
    <>
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="learn"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="translation"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="dictionary"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="context"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="visual"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
      <ReviewButton
        listLanguage={language.code}
        listNumber={listNumber}
        mode="spellingBee"
        stats={listStats}
        unlockedModes={unlockedLearningModesForUser}
      />
    </>
  );
}
