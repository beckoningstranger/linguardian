import { MouseEventHandler, ReactElement } from "react";

interface SidebarProps {
  icon: ReactElement;
  label: String;
  action?: MouseEventHandler;
  classes?: String;
}

export default function SidebarItem({
  icon,
  label,
  action,
  classes,
}: SidebarProps) {
  return (
    <div
      className={`flex gap-2 w-full mb-3 py-3 px-3 items-center justify-center md:justify-start select-none hover:text-slate-200 ${classes}`}
      onClick={action}
    >
      {icon}
      <div>{label}</div>
    </div>
  );
}
