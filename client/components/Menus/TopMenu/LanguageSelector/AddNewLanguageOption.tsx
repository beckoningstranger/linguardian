import paths from "@/lib/paths";
import Link from "next/link";
import { RxPlus } from "react-icons/rx";

export default function AddNewLanguageOption() {
  return (
    <Link
      href={paths.learnNewLanguagePath()}
      className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-300 transition-all hover:scale-125 md:h-12 md:w-12`}
    >
      <RxPlus className="text-6xl md:text-3xl" />
    </Link>
  );
}
