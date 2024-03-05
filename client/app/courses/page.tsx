import Link from "next/link";

export default function Store() {
  return (
    <div className="m-3 p-2">
      <p className="m-4">Course Store</p>
      <div>
        <Link
          href="/courses/new"
          className="m-2 rounded border border-black bg-slate-200 p-3"
        >
          Upload CSV
        </Link>
      </div>
    </div>
  );
}
