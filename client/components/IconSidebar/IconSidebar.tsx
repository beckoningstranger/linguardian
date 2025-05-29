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
      className={cn("hidden flex-col z-20 rounded-lg gap-2 m-2", show)}
    >
      <div className={position === "left" ? "w-[80px]" : "w-[90px]"}>
        <div
          className={cn(
            "flex flex-col gap-2",
            position === "left" ? "items-start" : "items-end"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
