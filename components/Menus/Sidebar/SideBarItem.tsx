import { MouseEventHandler, ReactElement } from "react";

interface SidebarProps {
  icon: ReactElement;
  label?: string;
  action?: MouseEventHandler;
  classes?: string;
}

export default function SidebarItem({
  icon,
  label,
  action,
  classes,
}: SidebarProps) {
  return (
    <div
      className={`flex w-full h-14 md:p-10 md:border-none transition-all
      select-none hover:bg-slate-300 justify-center md:justify-start my-2 md:my-0 ${classes}`}
      onClick={action}
    >
      <div className="flex gap-4 items-center w-48">
        <div className="text-3xl">{icon}</div>
        {label && <div className="text-2xl md:text-xl">{label}</div>}
      </div>
    </div>
  );
}
