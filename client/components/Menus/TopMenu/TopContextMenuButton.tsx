import { cn } from "@/lib/helperFunctionsClient";
import { Button } from "@headlessui/react";
import Link from "next/link";
import {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
} from "react";

interface TopContextMenuButtonProps {
  label: string;
  onClick?: MouseEventHandler;
  icon?: ReactElement;
  mode: "delete" | "back" | "edit" | "stop";
  link?: string;
  setContextExpanded?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

export default function TopContextMenuButton({
  label,
  onClick,
  icon,
  mode,
  link,
  disabled,
  setContextExpanded,
}: TopContextMenuButtonProps) {
  const handleClick: MouseEventHandler = (e) => {
    if (setContextExpanded) setContextExpanded(false);
    onClick?.(e);
  };

  const button = (
    <Button
      className={cn(
        "relative flex h-20 w-full items-center rounded-lg px-2 text-white tablet:hidden transition-all duration-500",
        mode === "delete" && "bg-red-500 hover:bg-red-600",
        mode === "edit" && "bg-green-400 hover:bg-green-500",
        mode === "back" &&
          "border-4 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500",
        mode === "stop" &&
          "border-orange-600 border-4 text-orange-600 bg-white hover:text-white hover:bg-orange-600",
        disabled && "bg-grey-500"
      )}
      onClick={handleClick}
    >
      {icon}
      <div className="absolute left-0 flex w-full justify-center text-clgb">
        {label}
      </div>
    </Button>
  );

  return link && link.length > 0 ? (
    <Link href={link}>{button}</Link>
  ) : (
    <>{button}</>
  );
}
