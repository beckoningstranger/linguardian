import { User } from "@/types";
import Image from "next/image";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="m-4 h-[60px] w-[60px] rounded-full bg-slate-200 md:h-[50px] md:w-[50px]">
      {user.image && (
        <Image
          src={user.image}
          alt="User profile image"
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
    </div>
  );
}
