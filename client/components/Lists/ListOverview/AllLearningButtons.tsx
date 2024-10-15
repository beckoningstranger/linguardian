"use client";

import ReviewButton from "@/components/ReviewButton";
import { LearningMode, ListStats } from "@/lib/types";
import { useMemo } from "react";

interface AllLearningButtonsProps {
  listNumber: number;
  unitNumber?: number;
  listStats: ListStats;
  unlockedLearningModesForUser?: LearningMode[];
}

export default function AllLearningButtons({
  listNumber,
  unitNumber,
  listStats,
  unlockedLearningModesForUser,
}: AllLearningButtonsProps) {
  const renderedButtons = useMemo(() => {
    if (!listNumber || !listStats || !unlockedLearningModesForUser) {
      return null;
    }

    return (
      <>
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="learn"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="translation"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="dictionary"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="context"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="visual"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
        <ReviewButton
          listNumber={listNumber}
          unitNumber={unitNumber}
          mode="spellingBee"
          stats={listStats}
          unlockedModes={unlockedLearningModesForUser}
        />
      </>
    );
  }, [listNumber, unitNumber, listStats, unlockedLearningModesForUser]);

  if (!renderedButtons) {
    return "Loading buttons...";
  }

  return renderedButtons;
}
