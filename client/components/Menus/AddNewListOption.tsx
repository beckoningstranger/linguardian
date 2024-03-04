import { HiOutlinePlusCircle } from "react-icons/hi2";
import Link from "next/link";

export default function AddNewListOption() {
  return (
    <Link
      href="/courses"
      className="flex  justify-center items-center mx-6 lg:mx-3 xl:mx-6 bg-slate-200 rounded-md relative min-h-40 md:min-h-80 h-full"
    >
      <div className="flex justify-center items-center bg-slate-100 size-4/5 rounded-md  text-6xl md:text-8xl text-slate-600 hover:scale-110 transition-all">
        <HiOutlinePlusCircle />
      </div>
    </Link>
  );
}
