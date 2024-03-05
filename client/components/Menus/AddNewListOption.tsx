import { HiOutlinePlusCircle } from "react-icons/hi2";
import Link from "next/link";

export default function AddNewListOption() {
  return (
    <Link
      href="/courses"
      className="relative mx-6 flex h-full min-h-40 items-center justify-center rounded-md bg-slate-200 md:min-h-80 lg:mx-3 xl:mx-6"
    >
      <div className="flex size-4/5 items-center justify-center rounded-md bg-slate-100 text-6xl text-slate-600 transition-all hover:scale-110 md:text-8xl">
        <HiOutlinePlusCircle />
      </div>
    </Link>
  );
}
