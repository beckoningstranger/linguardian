import { getUserById } from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";

interface ProfilePageProps {}

export default async function ProfilePage({}: ProfilePageProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  return (
    <>
      <div>{user?.username}&apos;s profile</div>
      <div>
        {user?.username} is learning{" "}
        {user?.languages.map((lang) => lang.name).join(" and ")}.
      </div>
    </>
  );
}
