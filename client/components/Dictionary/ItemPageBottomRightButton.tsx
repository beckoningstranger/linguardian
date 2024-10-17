import Link from "next/link";
import { MdEdit } from "react-icons/md";
import BottomRightButton from "../BottomRightButton";

interface ItemPageBottomRightButtonProps {
  path: string;
}

export default function ItemPageBottomRightButton({
  path,
}: ItemPageBottomRightButtonProps) {
  return (
    <Link href={path}>
      <BottomRightButton
        icon={<MdEdit className="h-8 w-8 text-white" />}
        ariaLabel="Edit this item"
      />
    </Link>
  );
}
