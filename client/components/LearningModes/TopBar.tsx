interface TopBarProps {
  listName: string;
  reviewedItems: number;
  totalItems: number;
}

export default function TopBar({
  listName,
  reviewedItems,
  totalItems,
}: TopBarProps) {
  return (
    <div id="TopBar" className="w-full bg-slate-200 text-center text-xl">
      <h1 className="font-semibold">Reviewing {listName}</h1>
      <h2>
        {reviewedItems + 1} / {totalItems} items
      </h2>
    </div>
  );
}
