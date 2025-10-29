import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IconSidebarProps {
  showOn: "desktop" | "tablet" | "desktopxl";
  children?: ReactNode;
  position: "left" | "right";
}

export default function IconSidebar({
  showOn,
  children,
  position,
}: IconSidebarProps) {
  const visibility =
    showOn === "tablet"
      ? "tablet:flex"
      : showOn === "desktop"
      ? "desktop:flex"
      : "desktopxl:flex";

  return (
    <div
      id={`IconSidebar-` + position}
      className={cn(
        "hidden flex-col z-20 rounded-lg gap-2 m-2",
        visibility,
        position === "left" ? "items-start w-[80px]" : "items-end w-[90px]"
      )}
    >
      {children}
    </div>
  );
}
