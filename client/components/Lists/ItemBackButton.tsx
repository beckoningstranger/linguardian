import paths from "@/lib/paths";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface ItemBackButtonProps {
  path?: string;
}

export default function ItemBackButton({ path }: ItemBackButtonProps) {
  return (
    <>
      <div className="md:hidden">
        <Link
          className="absolute left-1/2 top-5 w-36 -translate-x-1/2 transform text-center text-[1rem] leading-tight md:hidden"
          href={path ? path : paths.dictionaryPath() + `?comingFrom=${path}`}
        >
          Back to <br /> List Overview
        </Link>
      </div>

      <div className="absolute top-24 hidden md:left-0 md:block lg:left-12">
        <Link
          href={path ? path : paths.dictionaryPath()}
          className="ml-2 mt-2 grid h-16 w-16 place-items-center rounded-md border-2 border-slate-300 bg-slate-100 p-4 text-2xl hover:scale-105 hover:bg-slate-200 active:scale-95"
        >
          <FaArrowLeft />
        </Link>
      </div>
    </>
  );
}
