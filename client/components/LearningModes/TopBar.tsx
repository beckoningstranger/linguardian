import { LearningMode } from "@/lib/types";

interface TopBarProps {
  listName: string;
  itemsInProgress: number;
  totalItems: number;
  mode: LearningMode;
}

export default function TopBar({
  listName,
  itemsInProgress,
  totalItems,
  mode,
}: TopBarProps) {
  let heading;
  switch (mode) {
    case "learn":
      heading = (
        <>
          <div className="text-sm">Learning new items in</div>
          {listName}
        </>
      );
      break;
    case "translation":
      heading = (
        <>
          <div>{listName}</div>
          <div className="text-sm">Reviewing items in Translation Mode</div>
        </>
      );
      break;
  }

  return (
    <div id="TopBar" className="w-full bg-slate-200 text-center text-xl">
      <h1 className="font-semibold">{heading}</h1>
      <h2 className="text-sm">
        {itemsInProgress} / {totalItems} items
      </h2>
    </div>
  );
}
