import { useOutsideClick } from "@/app/hooks/useOutsideClick";
import { MouseEventHandler, ReactNode } from "react";

interface SideBarNavigationProps {
  toggleSidebar: MouseEventHandler;
  showSidebar: Boolean;
  children: ReactNode;
}

export default function SideBarNavigation({
  toggleSidebar,
  showSidebar,
  children,
}: SideBarNavigationProps) {
  const ref = useOutsideClick(toggleSidebar!, showSidebar);

  return (
    <div
      className={`flex text-xl backdrop-blur-md absolute top-0 h-full ${
        showSidebar ? "w-full md:w-48" : "-translate-x-[300px]"
      } transition-all flex-col justify-center md:justify-start md:items-start md:space-between`}
      ref={ref}
    >
      {children}
    </div>
  );
}
