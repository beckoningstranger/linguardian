import { useRef, useState } from "react";
import { RxDotsVertical } from "react-icons/rx";

import ContextMenu from "./Menus/ContextMenu";
import ReviewButton from "./ReviewButton";
import { useLoaded } from "@/app/hooks/useLoaded";
import { ListStats } from "./Dashboard";
import ListBarChart from "@/components/Charts/ListBarChart";
import ListPieChart from "./Charts/ListPieChart";

interface ListCardProps {
  title: string;
  id: number;
  status: string;
  stats: ListStats;
}

export default function ListCard({ title, status, stats, id }: ListCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showAllReviewModes, setShowAllReviewModes] = useState(false);
  const loaded = useLoaded();

  let renderedButtons;

  const persistentRandomModes = useRef(pickRandomModes(excluded(status)));
  const [randomMode1, randomMode2, randomMode3] = persistentRandomModes.current;

  if (status === "review") {
    renderedButtons = (
      <div className="flex md:flex-col justify-around">
        <ReviewButton id={id} mode="translation" />
        <ReviewButton id={id} mode={loaded ? randomMode1 : "spinner"} />
        <div className="md:hidden">
          <ReviewButton id={id} mode={loaded ? randomMode2 : "spinner"} />
        </div>

        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
        />
      </div>
    );
  } else if (status === "add") {
    renderedButtons = (
      <div className="flex md:flex-col justify-around">
        <ReviewButton id={id} mode="learn" />
        <ReviewButton id={id} mode={loaded ? randomMode1 : "spinner"} />
        <div className="md:hidden">
          <ReviewButton id={id} mode={loaded ? randomMode2 : "spinner"} />
        </div>

        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
        />
      </div>
    );
  } else if (status === "practice") {
    renderedButtons = (
      <div className="flex md:flex-col justify-around">
        <ReviewButton id={id} mode={loaded ? randomMode1 : "spinner"} />
        <ReviewButton id={id} mode={loaded ? randomMode2 : "spinner"} />
        <div className="md:hidden">
          <ReviewButton id={id} mode={loaded ? randomMode3 : "spinner"} />
        </div>
        <ReviewButton
          id={id}
          mode="more"
          showAllModes={setShowAllReviewModes}
        />
      </div>
    );
  } else {
    return <h1>Mode not set correctly</h1>;
  }

  return (
    <div className="mx-6 lg:mx-3 xl:mx-6 bg-slate-200 rounded-md relative">
      <ContextMenu
        show={showContextMenu}
        toggleContextMenu={() => setShowContextMenu(false)}
        positionClasses="top-0 left-0"
      >
        <div className="m-4 flex flex-col">
          <p>Archive List</p>
          <p>Delete List</p>
          <p>Edit List</p>
          <p>And maybe more options!</p>
        </div>
      </ContextMenu>
      <ContextMenu
        show={showAllReviewModes}
        toggleContextMenu={() => setShowAllReviewModes(false)}
        positionClasses="bottom-0 right-0 w-full"
      >
        <div className="grid grid-cols-3 md:grid-cols-2 place-items-center md:h-full">
          <ReviewButton id={id} mode="learn" />
          <ReviewButton id={id} mode="translation" />
          <ReviewButton id={id} mode="dictionary" />
          <ReviewButton id={id} mode="context" />
          <ReviewButton id={id} mode="visual" />
          <ReviewButton id={id} mode="spelling" />
        </div>
      </ContextMenu>
      <div className="flex items-center m-3 justify-between">
        <div
          className="hover:text-white py-2 pr-2 text-2xl"
          onClick={() => setShowContextMenu(true)}
        >
          <RxDotsVertical />
        </div>
        <div className="w-full pl-2">
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly md:w-full my-3 md:mx-0 xl:px-0 px-2">
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

function pickRandomModes(exclude: string[]): string[] {
  // Pass this an array of review modes that should be excluded
  // and it will return an array of two other review modes.
  const options = [
    "translation",
    "context",
    "visual",
    "spelling",
    "dictionary",
  ];
  let modes: string[] = [];
  let findingFirstOption = true;
  while (findingFirstOption) {
    let option1 = options[Math.floor(Math.random() * options.length)];
    if (!exclude.includes(option1)) {
      modes.push(option1);
      findingFirstOption = false;
    }
  }
  let findingSecondOption = true;
  while (findingSecondOption) {
    let option2 = options[Math.floor(Math.random() * options.length)];
    if (!modes.includes(option2) && !exclude.includes(option2)) {
      modes.push(option2);
      findingSecondOption = false;
    }
  }
  let findingThirdOption = true;
  while (findingThirdOption) {
    let option2 = options[Math.floor(Math.random() * options.length)];
    if (!modes.includes(option2) && !exclude.includes(option2)) {
      modes.push(option2);
      findingThirdOption = false;
    }
  }
  return modes;
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
