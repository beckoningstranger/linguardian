import paths from "@/lib/paths";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "../ui/Button";
import { cn } from "@/lib/helperFunctionsClient";

interface UnitHeaderProps {
  unitName?: string;
  unitNumber: number;
  itemNumber: number;
  listNumber: number;
  unitCount: number;
}

export default function UnitHeader({
  unitName = "New Unit",
  unitNumber,
  itemNumber,
  listNumber,
  unitCount,
}: UnitHeaderProps) {
  return (
    <div className="flex w-full justify-between bg-white/90 tablet:min-w-[620px] tablet:rounded-lg">
      <Link
        href={paths.unitDetailsPath(listNumber, unitNumber - 1)}
        aria-disabled={unitNumber < 2}
        className={cn(
          "h-[88px] w-[88px]",
          unitNumber < 2 && "cursor-not-allowed pointer-events-none"
        )}
      >
        <Button
          disabled={unitNumber < 2}
          noRing
          color="transparent"
          intent="icon"
          className={cn("h-full w-full")}
        >
          <FaArrowLeft className="h-11 w-11" />
        </Button>
      </Link>
      <div className="flex select-none flex-col justify-center">
        <div className="text-cxlb">{unitName}</div>
        <div className="text-cmdr">({itemNumber} items)</div>
      </div>
      <Link
        href={paths.unitDetailsPath(listNumber, unitNumber + 1)}
        aria-disabled={unitNumber > unitCount - 1}
        className={cn(
          "h-[88px] w-[88px]",
          unitNumber > unitCount - 1 && "cursor-not-allowed pointer-events-none"
        )}
      >
        <Button
          className="h-full w-full"
          intent="icon"
          noRing
          disabled={unitNumber > unitCount - 1}
        >
          <FaArrowRight className="h-11 w-11" />
        </Button>
      </Link>
    </div>
  );
}
