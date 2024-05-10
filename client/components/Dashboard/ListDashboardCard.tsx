"use client";
import { useRef, useState } from "react";
import { RxDotsVertical } from "react-icons/rx";

import ContextMenu from "../Menus/ContextMenu";
import ReviewButton from "../ReviewButton";
import { useLoaded } from "@/hooks/useLoaded";
import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "../Charts/ListPieChart";
import { LearningMode, ListStats, ListStatus } from "@/types";
import Link from "next/link";
import paths from "@/paths";

interface ListDashboardCardProps {
  title: string;
  id: number;
  status: ListStatus;
  stats: ListStats;
}

export default function ListDashboardCard({
  title,
  status,
  stats,
  id,
}: ListDashboardCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showAllReviewModes, setShowAllReviewModes] = useState(false);
  const loaded = useLoaded();

  let renderedButtons;

  const persistentRandomModes = useRef(pickRandomModes(excluded(status)));
  const [randomMode1, randomMode2, randomMode3] = persistentRandomModes.current;

  if (status === "review") {
    renderedButtons = (
      <div className="flex justify-around md:flex-col">
        <ReviewButton id={id} mode="translation" stats={stats} />
        <ReviewButton
          id={id}
          mode={loaded ? randomMode1 : "spinner"}
          stats={stats}
        />
        <div className="md:hidden">
          <ReviewButton
            id={id}
            mode={loaded ? randomMode2 : "spinner"}
            stats={stats}
          />
        </div>

        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
          stats={stats}
        />
      </div>
    );
  } else if (status === "add") {
    renderedButtons = (
      <div className="flex justify-around md:flex-col">
        <ReviewButton id={id} mode="learn" stats={stats} />
        <ReviewButton
          id={id}
          mode={loaded ? randomMode1 : "spinner"}
          stats={stats}
        />
        <div className="md:hidden">
          <ReviewButton
            id={id}
            mode={loaded ? randomMode2 : "spinner"}
            stats={stats}
          />
        </div>

        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
          stats={stats}
        />
      </div>
    );
  } else if (status === "practice") {
    renderedButtons = (
      <div className="flex justify-around md:flex-col">
        <ReviewButton
          id={id}
          mode={loaded ? randomMode1 : "spinner"}
          stats={stats}
        />
        <ReviewButton
          id={id}
          mode={loaded ? randomMode2 : "spinner"}
          stats={stats}
        />
        <div className="md:hidden">
          <ReviewButton
            id={id}
            mode={loaded ? randomMode3 : "spinner"}
            stats={stats}
          />
        </div>
        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
          stats={stats}
        />
      </div>
    );
  } else {
    return <h1>Mode not set correctly</h1>;
  }

  return (
    <div className="relative mx-6 rounded-md bg-slate-200 lg:mx-3 xl:mx-6">
      <ContextMenu
        show={showContextMenu}
        toggleContextMenu={() => setShowContextMenu(false)}
        positionClasses="top-0 left-0"
      >
        <div className="m-4 flex flex-col">
          <p>Archive List</p>
          <p>Remove list & Stop learning</p>
          <p>Edit List (if author)</p>
        </div>
      </ContextMenu>
      <ContextMenu
        show={showAllReviewModes}
        toggleContextMenu={() => setShowAllReviewModes(false)}
        positionClasses="bottom-0 right-0 w-full"
      >
        <div className="grid grid-cols-3 place-items-center md:h-full md:grid-cols-2">
          <ReviewButton id={id} mode="learn" stats={stats} />
          <ReviewButton id={id} mode="translation" stats={stats} />
          <ReviewButton id={id} mode="dictionary" stats={stats} />
          <ReviewButton id={id} mode="context" stats={stats} />
          <ReviewButton id={id} mode="visual" stats={stats} />
          <ReviewButton id={id} mode="spellingBee" stats={stats} />
        </div>
      </ContextMenu>
      <div className="m-3 flex items-center justify-between">
        <div
          className="py-2 pr-2 text-2xl hover:text-white"
          onClick={() => setShowContextMenu(true)}
        >
          <RxDotsVertical />
        </div>
        <Link href={paths.listDetailsPath(id)} className="w-full pl-2">
          <h2 className="text-lg font-semibold">{title}</h2>
        </Link>
      </div>

      <div className="my-3 flex flex-col justify-evenly px-2 md:mx-0 md:w-full md:flex-row xl:px-0">
        <div className="md:hidden">
          <ListBarChart stats={stats} />
        </div>
        <div className="hidden md:block">
          <ListPieChart stats={stats} />
        </div>

        {renderedButtons}
      </div>
    </div>
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
