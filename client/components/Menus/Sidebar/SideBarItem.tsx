import { ReactElement } from "react";
import Link from "next/link";

interface SidebarProps {
  icon: ReactElement;
  label: string;
  href: string;
}

export default function SidebarItem({ icon, label, href }: SidebarProps) {
  return (
    <Link
      href={href}
      className={`my-4 flex h-14 w-full select-none justify-center transition-all md:my-0 md:justify-start md:border-none md:p-10 md:hover:scale-100 md:hover:bg-slate-300`}
    >
      <div className="flex w-48 md:items-center">
        <div className="px-3 text-4xl md:pl-3">{icon}</div>
        {label && <div className="px-3 text-4xl md:text-xl">{label}</div>}
      </div>
    </Link>
  );
}
