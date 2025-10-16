import { Button } from "@headlessui/react";

interface UnitButtonProps {
  fillWidth: string;
  unitName: string;
  noOfItemsInUnit: number;
}

export default function UnitButton({
  fillWidth,
  unitName,
  noOfItemsInUnit,
}: UnitButtonProps) {
  return (
    <Button className="relative flex h-[90px] w-full flex-col justify-center rounded-lg bg-white/90 text-center text-cmdb shadow-lg transition-colors duration-300 hover:bg-white tablet:text-clgb">
      <h3>{unitName}</h3>
      <h4 className="text-center text-csmr">
        ({noOfItemsInUnit} {noOfItemsInUnit === 1 ? "item" : "items"})
      </h4>
      <div
        style={{
          width: fillWidth,
        }}
        className="absolute bottom-0 left-0 h-2 w-full rounded-b-lg bg-green-300"
      />
    </Button>
  );
}
