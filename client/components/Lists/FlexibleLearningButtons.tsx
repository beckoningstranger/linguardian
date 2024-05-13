"use client";
import { LearningMode, ListStats, ListStatus } from "@/types";
import { useRef, useState } from "react";
import ReviewButton from "../ReviewButton";
import { useLoaded } from "@/hooks/useLoaded";
import ContextMenu from "../Menus/ContextMenu";
import AllLearningButtons from "./ListOverview/AllLearningButtons";

interface FlexibleLearningButtonsProps {
  status: ListStatus;
  stats: ListStats;
  listNumber: number;
}

export default function FlexibleLearningButtons({
  status,
  stats,
  listNumber,
}: FlexibleLearningButtonsProps) {
  const loaded = useLoaded();
  const [showAllReviewModes, setShowAllReviewModes] = useState(false);

  const persistentRandomModes = useRef(pickRandomModes(excluded(status)));
  const [randomMode1, randomMode2, randomMode3] = persistentRandomModes.current;

  let firstButtonMode: LearningMode | "spinner" | "more" = "spinner";

  if (status === "add") firstButtonMode = "learn";
  if (status === "review") firstButtonMode = "translation";
  if (status === "practice") firstButtonMode = loaded ? randomMode1 : "spinner";

  const renderedButtons = (
    <div className="flex justify-around md:flex-col">
      {/* First Button */}
      <ReviewButton
        listNumber={listNumber}
        mode={firstButtonMode}
        stats={stats}
      />
      {/* Second Button */}
      <ReviewButton
        listNumber={listNumber}
        mode={
          loaded
            ? status === "practice"
              ? randomMode2
              : randomMode1
            : "spinner"
        }
        stats={stats}
      />
      {/* Button Only Visible on Mobile */}
      <div className="md:hidden">
        <ReviewButton
          listNumber={listNumber}
          mode={
            loaded
              ? status === "practice"
                ? randomMode3
                : randomMode2
              : "spinner"
          }
          stats={stats}
        />
      </div>
      {/* More Button */}
      <ReviewButton
        listNumber={listNumber}
        mode="more"
        showAllModes={setShowAllReviewModes}
        stats={stats}
      />
    </div>
  );

  return (
    <>
      <ContextMenu
        show={showAllReviewModes}
        toggleContextMenu={() => setShowAllReviewModes(false)}
        moreClasses="absolute bottom-0 right-0 w-full border-slate-300 border-t-4 md:border-t-0 md:border-l-4 h-36"
      >
        <div className="grid grid-cols-3 place-items-center md:h-full md:grid-cols-2">
          <AllLearningButtons listNumber={listNumber} listStats={stats} />
        </div>
      </ContextMenu>
      {renderedButtons}
    </>
  );
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
