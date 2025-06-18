import { notFound } from "next/navigation";

import ActivityChart from "@/components/Profile/ActivityChart";
import LearnedLanguageInfo from "@/components/Profile/LearnedLanguageInfo";
import UserOverview from "@/components/Profile/UserOverview";
import { getUserByUsernameSlug } from "@/lib/fetchData";

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
  const user = await getUserByUsernameSlug(usernameSlug);
  if (!user) notFound();

  return (
    <div
      className="relative flex justify-center px-1 py-8 phone:px-2 tablet:px-4 tablet:py-12"
      id="ProfileMain"
    >
      <div className="grid w-full max-w-[1200px] gap-y-12">
        <UserOverview user={user} />
        <ActivityChart />
        <LearnedLanguageInfo user={user} />
      </div>
    </div>
  );
}
