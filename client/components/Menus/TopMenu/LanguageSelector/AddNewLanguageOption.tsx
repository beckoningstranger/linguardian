import paths from "@/lib/paths";
import Link from "next/link";
import { RxPlus } from "react-icons/rx";

export default function AddNewLanguageOption() {
  return (
    <Link
      href={paths.learnNewLanguagePath()}
      className={`flex h-24 w-24 items-center justify-center rounded-full border border-grey-600 bg-white/80 transition-all hover:scale-125 md:h-[75px] md:w-[75px]`}
    >
      <RxPlus className="text-5xl tablet:scale-150 tablet:text-2xl" />
    </Link>
  );
}
