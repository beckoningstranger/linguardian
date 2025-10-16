import { UnitHeaderArrowButton } from "@/components";

interface UnitHeaderProps {
  unitName?: string;
  itemNumber: number;
}

export default function UnitHeader({
  unitName = "New Unit",
  itemNumber,
}: UnitHeaderProps) {
  return (
    <div className="flex h-[80px] w-full justify-between bg-white/90 text-center tablet:min-w-[620px] tablet:rounded-lg">
      <UnitHeaderArrowButton location="unitOverview" direction="left" />
      <div className="flex select-none flex-col justify-center">
        <div className="text-cxlb">{unitName}</div>
        <div className="text-cmdr">({itemNumber} items)</div>
      </div>
      <UnitHeaderArrowButton location="unitOverview" direction="right" />
    </div>
  );
}
