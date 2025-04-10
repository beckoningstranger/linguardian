import { cn } from "@/lib/helperFunctionsClient";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { BsMortarboard } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { ImStop } from "react-icons/im";
import { TbPencil, TbTrash } from "react-icons/tb";

interface IconSidebarButtonProps {
  type: "start" | "stop" | "delete" | "edit" | "back";
  disabled?: boolean;
  onClick?: MouseEventHandler;
  link?: string;
  label?: string;
}

export default function IconSidebarButton({
  type,
  disabled,
  onClick,
  link,
  label,
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
  };

  const button = (
    <Button
      className={cn(
        "transition-all duration-800 ease-in-out bg-white/90 items-center gap-4 hover:text-white shadow-xl rounded-md flex w-[80px] group hover:w-[500px]",
        config[type].styles
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={label || config[type].label}
    >
      <div id="icon" className="h-20 w-20 p-3">
        {config[type].icon}
      </div>
      <div className="duration-800 hidden h-20 w-full items-center justify-center truncate pr-4 font-serif text-hmd text-white transition-all ease-in-out group-hover:flex">
        {label || config[type].label}
      </div>
    </Button>
  );

  return link === undefined ? button : <Link href={link}>{button}</Link>;
}
