import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import { FaArrowLeft, FaPencil } from "react-icons/fa6";

interface BackToListOverviewButtonProps {
  listNumber: number;
  listAuthors: string[];
  listLanguage: SupportedLanguage;
  userId: string;
}

export default function BackToListAndEditButtons({
  listAuthors,
  listNumber,
  listLanguage,
  userId,
}: BackToListOverviewButtonProps) {
  return (
    <>
      <div className="md:hidden">
        {!listAuthors.includes(userId) && (
          <Link
            href={paths.listDetailsPath(listNumber, listLanguage)}
            className="mb-2 flex h-16 items-center justify-center border-y-2 border-slate-300 bg-slate-100 px-12 text-lg hover:bg-slate-200 md:mx-2 md:rounded-md"
          >
            Back to list overview
          </Link>
        )}
        {listAuthors.includes(userId) && (
          <div className="mb-2 flex h-16 items-center justify-evenly border-y-2 border-slate-300 bg-slate-100 px-2 text-sm transition-all sm:text-lg md:mx-2 md:rounded-md md:border-2">
            <Link
              href={paths.listDetailsPath(listNumber, listLanguage)}
              className="flex h-16 items-center border-y-2 border-slate-300 px-4 hover:bg-slate-200"
            >
              Back to list overview
            </Link>
            <div className="flex h-16 items-center border-y-2 border-slate-300 px-12 hover:bg-slate-200">
              Edit unit
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-24 hidden md:left-0 md:block lg:left-12">
        <Link
          href={paths.listDetailsPath(listNumber, listLanguage)}
          className="ml-2 mt-2 grid h-16 w-16 place-items-center rounded-md border-2 border-slate-300 bg-slate-100 p-4 text-2xl hover:scale-105 hover:bg-slate-200 active:scale-95"
        >
          <FaArrowLeft />
        </Link>
        {listAuthors.includes(userId) && (
          <div className="ml-2 mt-2 grid h-16 w-16 place-items-center rounded-md border-2 border-slate-300 bg-slate-100 p-4 text-2xl hover:scale-105 hover:bg-slate-200 active:scale-95">
            <FaPencil />
          </div>
        )}
      </div>
    </>
  );
}
