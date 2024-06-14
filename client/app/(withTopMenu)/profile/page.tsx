import { getUserById } from "@/lib/fetchData";
import getUserOnServer from "@/lib/getUserOnServer";
import { Metadata } from "next";

interface ProfilePageProps {}

export const metadata: Metadata = {
  title: "Your Profile",
};

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
