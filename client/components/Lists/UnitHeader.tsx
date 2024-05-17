import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
    <div className="flex h-20 items-center justify-between border-y-2 border-slate-300 text-xl md:mt-24">
      <Link
        href={`/lists/${listNumber}/${unitNumber - 1}`}
        className={`grid h-20 w-32 place-items-center text-3xl hover:bg-slate-100 hover:text-4xl hover:scale-90 rounded-md ${
          unitNumber < 2 ? "pointer-events-none text-gray-400" : ""
        }`}
        aria-disabled={unitNumber < 2}
        tabIndex={unitNumber < 2 ? -1 : undefined}
      >
        <FaArrowLeft />
      </Link>
      <div className="flex h-20 w-full flex-col justify-center">
        <div className="flex items-center justify-center text-xl">
          {unitName}
        </div>
        <div className="flex items-center justify-center text-sm">
          ({itemNumber} items)
        </div>
      </div>
      <Link
        href={`/lists/${listNumber}/${unitNumber + 1}`}
        className={`grid h-20 w-32 place-items-center text-3xl hover:bg-slate-100 hover:text-4xl hover:scale-90 rounded-md ${
          unitNumber > unitCount - 1 ? "pointer-events-none text-gray-400" : ""
        }`}
        aria-disabled={unitNumber > unitCount - 1}
        tabIndex={unitNumber > unitCount - 1 ? -1 : undefined}
      >
        <FaArrowRight />
      </Link>
    </div>
  );
}
