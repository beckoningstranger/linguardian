import { cn } from "@/lib/helperFunctionsClient";
import { ReactNode } from "react";

interface IconSidebarProps {
  showOn: "desktop" | "tablet" | "desktopxl";
  children?: ReactNode;
}

export default function IconSidebar({ showOn, children }: IconSidebarProps) {
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
      {children}
    </div>
  );
}
