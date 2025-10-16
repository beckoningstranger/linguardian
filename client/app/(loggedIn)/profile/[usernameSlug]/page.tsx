import { notFound } from "next/navigation";

import ActivityChart from "@/components/Profile/ActivityChart";
import LearnedLanguageInfo from "@/components/Profile/LearnedLanguageInfo";
import UserOverview from "@/components/Profile/UserOverview";
import { getUserOnServer } from "@/lib/utils/server";

interface ProfilePageProps {
  params: { usernameSlug: string };
}

// export async function generateMetadata({
//   params: { usernameSlug },
// }: ProfilePageProps) {
//   const user = await getUserByUsernameSlug(usernameSlug);
//   return { title: `${user?.username}'s Profile` };
// }

// export async function generateStaticParams() {
//   return await getAllUsernameSlugs();
// }

export default async function ProfilePage({
  params: { usernameSlug },
}: ProfilePageProps) {
  // Get user id via resolveUserId
  // Get user with user id
  // Render the profile

  const user = await getUserOnServer();
  if (!user) throw new Error("User not found");

  // Alternatively: send usernameSlug to BE, get back all the data we need and cache it as profile data
  // Invalidate it when a user's data is updated.

  return (
    <div
      className="relative flex justify-center px-1 py-8 phone:px-2 tablet:px-4 tablet:py-12"
      id="ProfileMain"
    >
      Not ready for production, but working on it...
      {/* <div className="grid w-full max-w-[1200px] gap-y-12">
        <UserOverview user={user} />
        <ActivityChart />
        <LearnedLanguageInfo user={user} />
      </div> */}
    </div>
  );
}
