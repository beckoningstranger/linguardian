"use client";

import { Button } from "@headlessui/react";
import Link from "next/link";
import React, { MouseEventHandler } from "react";
import { BsMortarboard } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { GiSaveArrow } from "react-icons/gi";
import { GrChapterAdd } from "react-icons/gr";
import { ImStop } from "react-icons/im";
import { TbPencil, TbTrash } from "react-icons/tb";
import { TiDocumentAdd } from "react-icons/ti";

import { Spinner } from "@/components";
import { cn } from "@/lib/utils";

type IconSidebarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  mode:
    | "start"
    | "stop"
    | "delete"
    | "edit"
    | "back"
    | "save"
    | "addItems"
    | "uploadCSV";
  onClick?: MouseEventHandler;
  link?: string;
  label?: string;
  busy?: boolean;
};

export default function IconSidebarButton({
  mode,
  disabled,
  onClick,
  link,
  label,
  busy,
  ...props
}: IconSidebarButtonProps) {
  const config = {
    delete: {
      icon: <TbTrash className="size-14" />,
      label: "Delete this list",
      styles: "hover:bg-red-500",
    },
    start: {
      icon: <BsMortarboard className="size-14" />,
      label: "Start learning this list",
      styles: "bg-green-400 text-white",
    },
    stop: {
      icon: <ImStop className="size-14" />,
      label: "Stop learning this list",
      styles: "hover:bg-orange-600",
    },
    edit: {
      icon: <TbPencil className="size-14" />,
      label: "Edit this list",
      styles: "hover:bg-yellow-500",
    },
    back: {
      icon: <FaArrowLeft className="size-14" />,
      label: "Back to list overview",
      styles: "hover:bg-blue-500",
    },
    save: {
      icon: <GiSaveArrow className="size-14" />,
      label: "Save your changes",
      styles:
        "bg-green-400 text-white hidden tablet:flex disabled:bg-white/90 disabled:text-grey-500",
    },
    addItems: {
      icon: <TiDocumentAdd className="size-14" />,
      label: "Add more items",
      styles: "hover:bg-orange-500",
    },
    uploadCSV: {
      icon: <GrChapterAdd className="size-14" />,
      label: "Upload a CSV File",
      styles: "hover:bg-orange-500",
    },
  };

  const button = (
    <Button
      className={cn(
        "transition-all duration-800 ease-in-out bg-white/90 items-center gap-4 hover:text-white shadow-xl rounded-md flex  group ",
        disabled ? "w-[80px]" : "w-[80px] hover:w-[500px]",
        config[mode].styles
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={label || config[mode].label}
      {...props}
    >
      {busy ? (
        <Spinner mini />
      ) : (
        <>
          <div id="icon" className="h-20 w-20 p-3">
            {config[mode].icon}
          </div>
          <div className="duration-800 hidden h-20 w-full items-center justify-center truncate pr-4 font-serif text-hmd text-white transition-all ease-in-out group-hover:flex">
            {label || config[mode].label}
          </div>
        </>
      )}
    </Button>
  );

  return link === undefined ? button : <Link href={link}>{button}</Link>;
}
