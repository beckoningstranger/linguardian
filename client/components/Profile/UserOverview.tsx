import BasicUserInfo from "@/components/Profile/BasicUserInfo";
import CompetencyBadge from "@/components/Profile/CompetencyBadge";
import ProfilePicWithBadges from "@/components/Profile/ProfilePicWithBadges";
import { User } from "@/lib/contracts";

interface UserOverviewProps {
  user: User;
}

export default function UserOverview({ user }: UserOverviewProps) {
  return (
    <>
      <div
        id="UserOverview"
        className="relative flex w-full flex-col items-center justify-center gap-4 rounded-md bg-white/90 p-4 pt-10 tablet:py-8 tablet:text-hmd desktop:flex-row desktop:justify-between desktop:p-8"
      >
        <CompetencyBadge total rating={726} />
        <div
          id="UserPicAndInfo"
          className="relative grid place-items-center gap-2 py-2 tablet:flex tablet:w-[600px] tablet:items-center tablet:justify-evenly tablet:gap-12 tablet:pt-8 desktop:w-full desktop:justify-start desktop:gap-24 desktop:pl-12 desktop:pr-8"
        >
          <ProfilePicWithBadges user={user} />
          <BasicUserInfo user={user} />
        </div>
        {/* <BadgeShowcase /> */}
      </div>
    </>
  );
}
