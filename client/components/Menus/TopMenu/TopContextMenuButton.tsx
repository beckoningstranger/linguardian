import Link from "next/link";

interface TopContextMenuButtonProps {
  href: string;
  label: string;
}

export default function TopContextMenuButton({
  href,
  label,
}: TopContextMenuButtonProps) {
  return (
    <Link href={href}>
      <button>{label}</button>
    </Link>
  );
}
