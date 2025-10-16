"use client";

import { useMemo } from "react";

import ReviewButton from "@/components/ReviewButton";
import { LearningMode, LearningStats } from "@/lib/contracts";

interface AllLearningButtonsProps {
  listNumber: number;
  unitNumber?: number;
  learningStats: LearningStats;
  unlockedLearningModesForUser?: LearningMode[];
}

export default function AllLearningButtons({
  listNumber,
  unitNumber,
  learningStats,
  unlockedLearningModesForUser,
}: AllLearningButtonsProps) {
  const renderedButtons = useMemo(() => {
    if (!listNumber || !learningStats || !unlockedLearningModesForUser) {
      return null;
    }

    return (
      <>
        <ReviewButton
          mode="learn"
          listNumber={listNumber}
          unitNumber={unitNumber}
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="translation"
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="dictionary"
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="context"
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="visual"
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="spellingBee"
          stats={learningStats}
          unlockedModes={unlockedLearningModesForUser}
        />
      </>
    );
  }, [listNumber, unitNumber, learningStats, unlockedLearningModesForUser]);

  if (!renderedButtons) {
    return "Loading buttons...";
  }

  return renderedButtons;
}
