import Link from "next/link";

interface ListStoreProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ListStore({ searchParams }: ListStoreProps) {
  console.log(searchParams);
  return (
    <div className="m-3 p-2">
      <p className="m-4">List Store</p>

      <Link
        href="/lists/new"
        className="m-2 rounded border border-black bg-slate-200 p-3"
      >
        Upload CSV
      </Link>
    </div>
  );
}
