import LoginForm from "@/components/authentication/LoginForm";
import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function Root() {
  const sessionUser = await getUserOnServer();
  if (sessionUser.native && sessionUser.isLearning)
    redirect(paths.dashboardLanguagePath(sessionUser.isLearning[0].name));

  return (
    <main>
      <LoginForm />
    </main>
  );
}
