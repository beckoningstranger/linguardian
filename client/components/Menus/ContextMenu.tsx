import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MouseEventHandler, ReactNode } from "react";

interface ContextMenuProps {
  show: Boolean;
  toggleContextMenu: MouseEventHandler;
  children: ReactNode;
  moreClasses: string;
}

export default function ContextMenu({
  show,
  toggleContextMenu,
  children,
  moreClasses,
}: ContextMenuProps) {
  const ref = useOutsideClick(toggleContextMenu, show);

  return (
    <div ref={ref}>
      {show && (
        <div
          className={`bg-slate-100 z-40 py-4 md:p-4 md:w-auto md:h-full flex flex-col justify-center transition-all ${moreClasses}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
