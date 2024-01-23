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
      className={`flex gap-2 w-full h-14 p-10 items-center justify-center md:justify-start 
      select-none hover:text-slate-200 ${classes}`}
      onClick={action}
    >
      {icon}
      {label && <div>{label}</div>}
    </div>
  );
}
