import { useOutsideClick } from "@/hooks/useOutsideClick";
import { MouseEventHandler, ReactNode } from "react";

interface ContextMenuProps {
  show: Boolean;
  toggleContextMenu: MouseEventHandler;
  children: ReactNode;
  positionClasses: string;
}

export default function ContextMenu({
  show,
  toggleContextMenu,
  children,
  positionClasses,
}: ContextMenuProps) {
  const ref = useOutsideClick(toggleContextMenu, show);

  return (
    <div ref={ref}>
      {show && (
        <div
          className={`bg-slate-100 absolute rounded-md z-40 py-4 md:p-4 md:w-auto max-h-fit h-full flex flex-col justify-center ${positionClasses} transition-all`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
