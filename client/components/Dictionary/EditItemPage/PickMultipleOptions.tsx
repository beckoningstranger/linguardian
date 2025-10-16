"use client";

import { Button } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

import MinusIcon from "@/components/Dictionary/EditItemPage/MinusIcon";
import { Tag } from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface PickMultipleOptionsProps {
  option: Tag;
  displayAll: boolean;
  setDisplayAll: Dispatch<SetStateAction<boolean>>;
  setTags: (tags: Tag[]) => void;
  tags: Tag[];
}

export default function PickMultipleOptions({
  option,
  displayAll,
  setDisplayAll,
  setTags,
  tags,
}: PickMultipleOptionsProps) {
  const handleClick = () => {
    if (!tags.includes(option)) setTags([...tags, option]);
    setDisplayAll(false);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering handleClick
    setTags(tags.filter((tag) => tag !== option));
    setDisplayAll(false);
  };

  const picked = tags.includes(option);

  const borderColor = picked
    ? displayAll
      ? "border-green-400"
      : "border-grey-400 border"
    : "border-red-500";

  return (
    <Button
      className={cn(
        "flex relative w-[150px] h-10 bg-white justify-between items-center rounded-md border-2 px-3 py-1 text-sm",
        borderColor,
        !picked && !displayAll && "hidden"
      )}
      onClick={handleClick}
    >
      <span>{option}</span>
      {picked && !displayAll && <MinusIcon onClick={handleRemoveClick} />}
    </Button>
  );
}
