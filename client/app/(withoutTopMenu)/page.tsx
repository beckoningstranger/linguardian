import LoginForm from "@/components/authentication/LoginForm";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function Root() {
  const user = await getUserOnServer();
  if (user?.learnedLanguages)
    redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));

  return (
    <main>
      <LoginForm />
    </main>
  );
}
