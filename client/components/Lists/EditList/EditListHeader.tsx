"use client";

import Image from "next/image";

import { ChangeListNameOrDescription } from "@/components";
import { useListContext } from "@/context/ListContext";

interface EditListHeaderProps {}

export default function EditListHeader({}: EditListHeaderProps) {
  const {
    listDescription,
    listName,
    listNumber,
    listLanguage,
    listImage = "/images/ListDefaultImage.webp",
  } = useListContext();

  const imageSrc =
    listImage && listImage.trim() !== ""
      ? listImage
      : "/images/ListDefaultImage.webp";

  return (
    <div className="relative flex gap-2 overflow-hidden bg-white/90 py-1 tablet:col-span-2 tablet:w-auto tablet:rounded-lg tablet:p-4">
      <Image
        src={imageSrc}
        alt="List image"
        height={200}
        width={200}
        priority
        className="h-[150px] w-[150px] rounded-md tablet:rounded-2xl tablet:shadow-xl"
      />

      <ChangeListNameOrDescription
        name={listName}
        listNumber={listNumber}
        description={listDescription}
        listLanguage={listLanguage.code}
      />
    </div>
  );
}
