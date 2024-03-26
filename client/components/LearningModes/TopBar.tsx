interface TopBarProps {
  listName: string;
  itemsInProgress: number;
  totalItems: number;
  mode: "learn" | "review";
}

export default function TopBar({
  listName,
  itemsInProgress,
  totalItems,
  mode,
}: TopBarProps) {
  return (
    <div id="TopBar" className="w-full bg-slate-200 text-center text-xl">
      <h1 className="font-semibold">
        <span className="text-sm">
          {mode === "learn" ? "Learning new items in" : "Reviewing items in"}
          <br />
        </span>
        {listName}
      </h1>
      <h2 className="text-sm">
        {itemsInProgress + 1} / {totalItems} items
      </h2>
    </div>
  );
}
