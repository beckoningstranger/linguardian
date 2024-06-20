import Link from "next/link";
import { MouseEventHandler, ReactElement } from "react";

interface UserMenuItemProps {
  icon: ReactElement;
  label: string;
  to?: string;
  onClick?: MouseEventHandler;
}

export default function UserMenuItem({
  icon,
  label,
  to,
  onClick,
}: UserMenuItemProps) {
  if (to)
    return (
      <Link
        href={to}
        className="flex items-center hover:cursor-pointer"
        onClick={onClick}
      >
        <span className="mx-4">
          <span className="text-xl">{icon}</span>
        </span>
        <span className="text-[1rem]">{label}</span>
      </Link>
    );

  return (
    <div className="flex items-center hover:cursor-pointer" onClick={onClick}>
      <span className="mx-4">
        <span className="text-xl">{icon}</span>
      </span>
      <span className="text-[1rem]">{label}</span>
    </div>
  );
}
