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
      className={`flex w-full h-14 md:m-2 md:p-10 md:border-none
      select-none hover:text-slate-200 justify-center md:justify-start my-2 ${classes}`}
      onClick={action}
    >
      <div className="flex gap-4 items-center w-48">
        {icon}
        {label && <div className="text-2xl md:text-xl">{label}</div>}
      </div>
    </div>
  );
}
