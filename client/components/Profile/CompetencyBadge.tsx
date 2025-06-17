import Image from "next/image";

import { cn } from "@/lib/helperFunctionsClient";
import { LanguageWithFlagAndName } from "@/lib/types";

interface CompetencyBadgeProps {
  rating: number;
  language?: LanguageWithFlagAndName;
  total?: boolean;
}

export default function CompetencyBadge({
  total = false,
  rating,
  language,
}: CompetencyBadgeProps) {
  return (
    <div
      id={`CompetencyBadge-${total ? "Total" : language?.name}`}
      className={cn(
        language &&
          "absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-blue-700 px-6 py-4 font-serif text-hmd text-white tablet:-top-8 justify-center min-w-[250px]",
        !language &&
          "absolute -top-6 left-1/2 flex w-[300px] -translate-x-1/2 items-center gap-1 rounded-full bg-blue-700 px-6 py-4 font-serif text-hsm text-white tablet:-top-8 tablet:w-[370px] justify-center tablet:px-8 tablet:text-hmd"
      )}
    >
      <Image
        src={"/icons/Crown.svg"}
        height={30}
        width={30}
        alt=""
        className="size-[30px] tablet:size-[48px]"
      />
      <p className="text-hsm tablet:text-hmd">
        <span></span>
        {total && "Total "}
        Competency:
        <span> </span>
        {rating}
      </p>
    </div>
  );
}
