"use client";
import { LearningMode, ListStats, ListStatus } from "@/lib/types";
import { useRef, useState } from "react";
import ReviewButton from "../../ReviewButton";
import { AllLearningButtonsContainer } from "../ListOverview/AllLearningButtonsContainer";
import AllLearningButtons from "../ListOverview/AllLearningButtons";

interface FlexibleLearningButtonsProps {
  status: ListStatus;
  stats: ListStats;
  listNumber: number;
  unlockedModes: LearningMode[] | undefined;
}

export default function FlexibleLearningButtons({
  status,
  stats,
  listNumber,
  unlockedModes,
}: FlexibleLearningButtonsProps) {
  const [showAllReviewModes, setShowAllReviewModes] = useState(false);

  const persistentRandomModes = useRef(pickRandomModes(excluded(status)));
  const [randomMode1, randomMode2, randomMode3] = persistentRandomModes.current;

  let firstButtonMode: LearningMode | "spinner" | "more" = "spinner";

  if (status === "add") firstButtonMode = "learn";
  if (status === "review") firstButtonMode = "translation";
  if (status === "practice") firstButtonMode = randomMode1;

  const renderedButtons = (
    <div className="flex justify-around md:mr-2 md:flex-col">
      {/* First Button */}
      <ReviewButton
        listNumber={listNumber}
        mode={firstButtonMode}
        stats={stats}
        unlockedModes={unlockedModes}
      />
      {/* Second Button */}
      <ReviewButton
        listNumber={listNumber}
        mode={status === "practice" ? randomMode2 : randomMode1}
        stats={stats}
        unlockedModes={unlockedModes}
      />
      {/* Button Only Visible on Mobile */}
      <div className="md:hidden">
        <ReviewButton
          listNumber={listNumber}
          mode={status === "practice" ? randomMode3 : randomMode2}
          stats={stats}
          unlockedModes={unlockedModes}
        />
      </div>
      {/* More Button */}
      <ReviewButton
        listNumber={listNumber}
        mode="more"
        showAllModes={setShowAllReviewModes}
        stats={stats}
        unlockedModes={unlockedModes}
      />
    </div>
  );

  return <>{renderedButtons}</>;
}

function pickRandomModes(exclude: string[]): LearningMode[] {
  // Pass this an array of review modes that should be excluded
  // and it will return an array of two other review modes.
  const options = [
    "translation",
    "context",
    "visual",
    "spellingBee",
    "dictionary",
  ];
  let modes: LearningMode[] = [];
  let findingFirstOption = true;
  while (findingFirstOption) {
    let option1 = options[Math.floor(Math.random() * options.length)];
    if (!exclude.includes(option1)) {
      modes.push(option1 as LearningMode);
      findingFirstOption = false;
    }
  }
  let findingSecondOption = true;
  while (findingSecondOption) {
    let option2 = options[Math.floor(Math.random() * options.length)];
    if (
      !modes.includes(option2 as LearningMode) &&
      !exclude.includes(option2)
    ) {
      modes.push(option2 as LearningMode);
      findingSecondOption = false;
    }
  }
  let findingThirdOption = true;
  while (findingThirdOption) {
    let option2 = options[Math.floor(Math.random() * options.length)];
    if (
      !modes.includes(option2 as LearningMode) &&
      !exclude.includes(option2)
    ) {
      modes.push(option2 as LearningMode);
      findingThirdOption = false;
    }
  }
  return modes as LearningMode[];
}

function excluded(status: string): string[] {
  // Pass this a status and it will return an array of strings of review modes that should not be displayed.
  // Rules can be set in the switch statement.
  // If users can later define favorite review modes and those should be excluded from the random
  // option, this is where to do it.
  let excluded: string[] = [];
  switch (status) {
    case "review":
      excluded.push("translation");
      break;
    default:
      break;
  }
  return excluded;
}
