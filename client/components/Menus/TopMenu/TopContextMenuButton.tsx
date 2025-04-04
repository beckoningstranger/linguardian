import { cn } from "@/lib/helperFunctionsClient";
import Link from "next/link";
import { MouseEventHandler, ReactElement } from "react";

interface TopContextMenuButtonProps {
  label: string;
  onClick?: MouseEventHandler;
  icon?: ReactElement;
  mode: "delete" | "back" | "edit";
  link?: string;
}

export default function TopContextMenuButton({
  label,
  onClick,
  icon,
  mode,
  link,
}: TopContextMenuButtonProps) {
  const button = (
    <button
      className={cn(
        "relative flex h-20 w-full items-center rounded-lg px-2 text-white tablet:hidden",
        mode === "delete" && "bg-red-500 hover:bg-red-600",
        mode === "back" &&
          "border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500"
      )}
      onClick={onClick}
    >
      {icon}
      <div className="flex w-full justify-center text-clgb">{label}</div>
    </button>
  );

  return link && link.length > 0 ? (
    <Link href={link}>{button}</Link>
  ) : (
    <>{button}</>
  );
}
