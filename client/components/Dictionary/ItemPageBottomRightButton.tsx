import Link from "next/link";
import BottomRightButton from "../BottomRightButton";
import { MdEdit } from "react-icons/md";
import paths from "@/lib/paths";

interface ItemPageBottomRightButtonProps {
  path: string;
}

export default function ItemPageBottomRightButton({
  path,
}: ItemPageBottomRightButtonProps) {
  return (
    <Link href={path}>
      <BottomRightButton icon={<MdEdit className="h-8 w-8 text-white" />} />
    </Link>
  );
}
