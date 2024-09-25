import StopLearningLanguageButton from "@/components/StopLearningLanguageButton";
import { getUserByUsernameSlug } from "@/lib/fetchData";

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

  return (
    <>
      <div>{user?.username}&apos;s profile</div>
      <div>
        {user?.username} is learning{" "}
        {user?.languages.map((lang) => lang.name).join(" and ")}.
      </div>

      <div className="flex flex-col gap-2">
        {user?.languages.map((lang) => (
          <StopLearningLanguageButton
            langCode={lang.code}
            langName={lang.name}
            key={lang.code}
          />
        ))}
      </div>
    </>
  );
}
