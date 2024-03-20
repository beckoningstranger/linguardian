import { MouseEventHandler, ReactElement } from "react";
import Link from "next/link";

interface SidebarProps {
  icon: ReactElement;
  label: string;
  href: string;
  toggleSidebar: MouseEventHandler;
}

export default function SidebarItem({
  icon,
  label,
  href,
  toggleSidebar,
}: SidebarProps) {
  return (
    <Link
      href={href}
      className={`my-4 flex select-none justify-center transition-all md:my-0 md:h-14 md:justify-start md:border-none md:p-10 md:hover:scale-100 md:hover:bg-slate-300`}
      onClick={toggleSidebar}
    >
      <div className="flex w-48 items-center">
        <div className="flex items-center px-3 text-3xl md:pl-3">{icon}</div>
        {label && <div className="px-3 text-2xl md:text-xl">{label}</div>}
      </div>
    </Link>
  );
}
