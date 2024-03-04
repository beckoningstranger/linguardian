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
      className={`flex w-full h-14 md:p-10 md:border-none transition-all
      select-none md:hover:bg-slate-300  md:hover:scale-100 justify-center md:justify-start my-4 md:my-0`}
    >
      <div className="flex md:items-center w-48">
        <div className="text-4xl md:pl-3 px-3">{icon}</div>
        {label && <div className="text-4xl md:text-xl px-3">{label}</div>}
      </div>
    </Link>
  );
}
