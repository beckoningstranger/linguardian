import {
  getAllLanguageFeatures,
  getAllUserIds,
  getUserByUsernameSlug,
} from "@/lib/fetchData";

interface ProfilePageProps {
  params: { usernameSlug: string };
}

export async function generateMetadata({
  params: { usernameSlug },
}: ProfilePageProps) {
  const user = await getUserByUsernameSlug(usernameSlug);
  return { title: `${user?.username}'s Profile` };
}

export async function generateStaticParams() {
  const allUserIds = await getAllUserIds();
  return allUserIds;
}

export default async function ProfilePage({
  params: { usernameSlug },
}: ProfilePageProps) {
  const [user, allLanguageFeatures] = await Promise.all([
    getUserByUsernameSlug(usernameSlug),
    getAllLanguageFeatures(),
  ]);

  const usersNativeLanguageName = allLanguageFeatures?.find(
    (langFeatures) => langFeatures.langCode === user?.native
  )?.langName;

  return (
    <>
      <h1>
        {`${
          user?.username
        }, a native ${usersNativeLanguageName} speaker is learning ${thisCommaThisAndThat(
          user?.languages.map((lang) => lang.name)!
        )}.`}
      </h1>
    </>
  );
}

function thisCommaThisAndThat(arr: string[]) {
  if (arr.length === 1) return arr[0];
  const allButLastItem = arr.slice(0, -1);
  const lastItem = arr.slice(-1);
  return `${allButLastItem.join(", ")} and ${lastItem[0]}`;
}
