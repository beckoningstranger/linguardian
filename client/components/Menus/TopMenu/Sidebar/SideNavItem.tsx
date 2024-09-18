import Link from "next/link";
import { ReactElement } from "react";

interface SideNavItemProps {
  icon: ReactElement;
  label: string;
  href: string;
  toggleSidebar?: Function;
}

export default function SideNavItem({
  icon,
  label,
  href,
  toggleSidebar,
}: SideNavItemProps) {
  return (
    <li className="list-none">
      <Link
        href={href}
        className={`my-4 flex select-none justify-center transition-all md:my-0 md:h-14 md:justify-start md:border-none md:p-10 md:pl-6 md:hover:scale-100 md:hover:bg-slate-300`}
        onClick={() => {
          if (toggleSidebar) toggleSidebar(false);
        }}
      >
        <div className="flex w-48 items-center">
          <div className="flex items-center px-3 text-3xl md:pl-3">{icon}</div>
          {label && <div className="px-3 text-2xl md:text-xl">{label}</div>}
        </div>
      </Link>
    </li>
  );
}
