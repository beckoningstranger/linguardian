import { MouseEventHandler } from "react";

import { MinusCircleIcon } from "@heroicons/react/20/solid";

export default function MinusIcon({
  onClick,
}: {
  onClick: MouseEventHandler<SVGSVGElement>;
}) {
  return (
    <MinusCircleIcon
      className="absolute right-0 h-full w-12 cursor-pointer rounded-r-md border border-transparent px-3 text-red-500 hover:bg-red-100"
      onClick={onClick}
    />
  );
}
