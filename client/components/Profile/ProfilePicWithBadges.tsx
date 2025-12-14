import Image from "next/image";
import Flag from "react-world-flags";

import StreakBadge from "@/components/Profile/StreakBadge";
import { User } from "@linguardian/shared/contracts";

interface ProfilePicWithBadgesProps {
  user: User;
}

export default function ProfilePicWithBadges({
  user,
}: ProfilePicWithBadgesProps) {
  return (
    <div className="relative min-w-[200px]" id="ProfilePicNativeLanguageStreak">
      {user?.image && (
        <Image
          src={user?.image}
          alt="User image"
          height={50}
          width={50}
          priority
          className="size-[200px] rounded-full drop-shadow-lg"
          id="UserPic"
        />
      )}
      <Flag
        code={user?.native.flag}
        className="absolute -left-8 bottom-0 size-[80px] rounded-full object-cover"
        id="UserNativeLanguageFlag"
      />
      <StreakBadge streak={22} />
    </div>
  );
}
