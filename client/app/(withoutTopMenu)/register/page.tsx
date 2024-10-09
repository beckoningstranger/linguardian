import RegisterForm from "@/components/authentication/RegisterForm";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create an account",
};

export default async function RegisterPage() {
  const user = await getUserOnServer();
  if (!user) return <RegisterForm />;

  if (!user.native || !user.learnedLanguages) {
    redirect(paths.welcomePath());
  }

  redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));
}
