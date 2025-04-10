import { cn } from "@/lib/helperFunctionsClient";
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
  const show =
    showOn === "tablet"
      ? "tablet:flex"
      : showOn === "desktop"
      ? "desktop:flex"
      : "desktopxl:flex";

  return (
    <div
      id="IconSidebar"
      className={cn("hidden flex-col rounded-lg gap-2", show)}
    >
      <div
        className={cn(
          "relative",
          position === "left" ? "w-[80px]" : "w-[90px]"
        )}
      >
        <div
          className={cn(
            "absolute flex flex-col gap-2 z-20",
            position === "left" ? "items-start left-0" : "items-end right-0"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
