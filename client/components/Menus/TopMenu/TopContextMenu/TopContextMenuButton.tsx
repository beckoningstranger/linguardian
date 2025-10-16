"use client";

import { Button } from "@headlessui/react";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { ImStop } from "react-icons/im";
import { TbPencil, TbTrash } from "react-icons/tb";

import { useTopContextMenu } from "@/context/TopContextMenuContext";
import { cn } from "@/lib/utils";
import { TiDocumentAdd } from "react-icons/ti";

interface NewTopContextMenuButtonProps {
  onClick?: MouseEventHandler;
  mode: "delete" | "back" | "edit" | "stop" | "addItems";
  target?: "list" | "unit" | "item";
  link?: string;
  disabled?: boolean;
}

export default function TopContextMenuButton({
  onClick,
  mode,
  link,
  target = "list",
  disabled,
}: NewTopContextMenuButtonProps) {
  const { setShowTopContextMenu } = useTopContextMenu();

  const handleClick: MouseEventHandler = (e) => {
    if (setShowTopContextMenu) setShowTopContextMenu(false);
    onClick?.(e);
  };

  const backTo =
    target !== "item"
      ? target + " overview"
      : link && !link.includes("dictionary")
      ? "list"
      : "dictionary";

  const config = {
    delete: {
      icon: <TbTrash className="size-16" />,
      label: `Delete this ${target}`,
      styles: "bg-red-500 hover:bg-red-600",
    },
    back: {
      icon: <HiArrowLeft className="size-16" />,
      label: `Back to ${backTo}`,
      styles:
        "border-4 border-blue-500 text-blue-500 bg-white hover:text-white hover:bg-blue-500",
    },
    stop: {
      icon: <ImStop className="size-16" />,
      label: "Stop learning this list",
      styles:
        "border-orange-600 border-2 text-orange-600 bg-white hover:text-white hover:bg-orange-600",
    },
    edit: {
      icon: <TbPencil className="size-16" />,
      label: `Edit this ${target}`,
      styles: "bg-yellow-500 hover:bg-yellow-600",
    },
    addItems: {
      icon: <TiDocumentAdd className="size-16" />,
      label: "Add more items to this unit",
      styles: "bg-orange-500 hover:bg-orange-600",
    },
  };

  const button = (
    <Button
      className={cn(
        "relative flex h-20 w-full items-center rounded-lg px-2 text-white tablet:hidden transition-all duration-500",
        config[mode].styles,
        disabled && "bg-grey-500 pointer-events-none cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {config[mode].icon}
      <div className="absolute left-0 flex w-full justify-center text-clgb">
        {config[mode].label}
      </div>
    </Button>
  );

  return link && link.length > 0 ? (
    <Link href={link}>{button}</Link>
  ) : (
    <>{button}</>
  );
}
