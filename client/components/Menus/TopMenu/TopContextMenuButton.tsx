import { cn } from "@/lib/helperFunctionsClient";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { ImStop } from "react-icons/im";
import { TbPencil, TbTrash } from "react-icons/tb";

interface TopContextMenuButtonProps {
  onClick?: MouseEventHandler;
  mode: "delete" | "back" | "edit" | "stop";
  target?: "list" | "unit";
  link?: string;
  setContextExpanded?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

export default function TopContextMenuButton({
  onClick,
  mode,
  link,
  target = "list",
  disabled,
  setContextExpanded,
}: TopContextMenuButtonProps) {
  const handleClick: MouseEventHandler = (e) => {
    if (setContextExpanded) setContextExpanded(false);
    onClick?.(e);
  };

  const config = {
    delete: {
      icon: <TbTrash className="size-16" />,
      label: `Delete this ${target}`,
      styles: "bg-red-500 hover:bg-red-600",
    },
    back: {
      icon: <HiArrowLeft className="size-16" />,
      label: `Back to ${target} overview`,
      styles:
        "border-4 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500",
    },
    stop: {
      icon: <ImStop className="size-16" />,
      label: "Stop learning this list",
      styles:
        "border-orange-600 border-4 text-orange-600 bg-white hover:text-white hover:bg-orange-600",
    },
    edit: {
      icon: <TbPencil className="size-16" />,
      label: `Edit this ${target}`,
      styles: "bg-yellow-500 hover:bg-yellow-600",
    },
  };

  const button = (
    <Button
      className={cn(
        "relative flex h-20  w-full items-center rounded-lg px-2 text-white tablet:hidden transition-all duration-500",
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
