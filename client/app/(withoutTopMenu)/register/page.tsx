import RegisterForm from "@/components/authentication/RegisterForm";
import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create an account",
};

export default async function RegisterPage() {
  const sessionUser = await getUserOnServer();
  if (!sessionUser) return <RegisterForm />;

  if (!sessionUser.native) redirect(paths.setNativeLanguagePath());
  if (!sessionUser.isLearning) redirect(paths.learnNewLanguagePath());

  if (sessionUser.native && sessionUser.isLearning)
    redirect(paths.dashboardLanguagePath(sessionUser.isLearning[0].name));
}
