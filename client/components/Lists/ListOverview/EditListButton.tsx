"use client";

import { useListContext } from "@/context/ListContext";
import paths from "@/lib/paths";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { TbPencil } from "react-icons/tb";

export default function EditListButton() {
  const {
    listData: { listNumber },
    userIsAuthor,
  } = useListContext();
  if (!userIsAuthor) return null;

  return (
    <Link href={paths.editListPath(listNumber)}>
      <Button className="duration-800 group flex size-[72px] items-center justify-center rounded-lg bg-white/90 text-grey-800 shadow-xl transition-all ease-in-out hover:w-[300px] hover:bg-yellow-500 hover:px-4 hover:text-white">
        <TbPencil className="h-14 w-14" />
        <div className="hidden w-full justify-center rounded-lg font-serif text-hmd group-hover:flex">
          Edit this list
        </div>
      </Button>
    </Link>
  );
}
