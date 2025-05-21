"use client";

import { useListContext } from "@/context/ListContext";
import Image from "next/image";
import ChangeListNameOrDescription from "./ChangeListNameOrDescription";
import CreatedByLine from "../ListOverview/CreatedByLine";

interface EditListHeaderProps {}

export default function EditListHeader({}: EditListHeaderProps) {
  const {
    listData: {
      name,
      listNumber,
      description,
      image = "/images/ListDefaultImage.webp",
      units,
    },
    authorData,
  } = useListContext();

  const numberOfItems = units.length;

  return (
    <div className="relative flex gap-2 overflow-hidden bg-white/90 py-1 tablet:col-span-2 tablet:w-auto tablet:rounded-lg tablet:p-4">
      <h3 className="absolute right-4 top-4 text-center text-csmr">
        {numberOfItems} items
      </h3>
      <Image
        src={image}
        alt="List image"
        height={200}
        width={200}
        priority
        className="h-[150px] w-[150px] rounded-md tablet:rounded-2xl tablet:shadow-xl"
      />
      <div className="flex w-full flex-col gap-1 phone:gap-2">
        <div className="my-1 leading-[1] tablet:leading-[1.2]">
          <CreatedByLine authorData={authorData} />
          <ChangeListNameOrDescription
            oldString={name}
            listNumber={listNumber}
            listProperty="listName"
            editStyling="font-serif text-hsm tablet:text-hmd w-full"
            nonEditStyling="font-serif text-hsm tablet:text-hmd hover:cursor-pointer "
          />
        </div>
        <ChangeListNameOrDescription
          oldString={description}
          listNumber={listNumber}
          listProperty="listDescription"
          editStyling="flex text-csmr tablet:text-cmdr flex-1 w-full resize-none overflow-hidden h-20"
          nonEditStyling="text-csmr tablet:text-cmdr w-full hover:cursor-pointer"
        />
      </div>
    </div>
  );
}
