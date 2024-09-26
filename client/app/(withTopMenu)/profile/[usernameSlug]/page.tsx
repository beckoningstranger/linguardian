import { getAllLanguageFeatures, getUserByUsernameSlug } from "@/lib/fetchData";

interface ProfilePageProps {
  params: { usernameSlug: string };
}

export async function generateMetadata({
  params: { usernameSlug },
}: ProfilePageProps) {
  const user = await getUserByUsernameSlug(usernameSlug);
  return { title: `${user?.username}'s Profile` };
}

// export async function generateStaticParams() {
//   const allUserIds = await getAllUserIds();
//   return allUserIds;
// }

export default async function ProfilePage({
  params: { usernameSlug },
}: ProfilePageProps) {
  const [user] = await Promise.all([getUserByUsernameSlug(usernameSlug)]);

  const allLanguageFeatures = await getAllLanguageFeatures();
  if (!allLanguageFeatures) throw new Error("Failed to get language features");

  return (
    <>
      <div>{user?.username}&apos;s profile</div>
      <div>
        {user?.username}, a native {user?.native} speaker is learning{" "}
        {user?.languages.map((lang) => lang.name).join(" and ")}.
      </div>
    </>
  );
}
