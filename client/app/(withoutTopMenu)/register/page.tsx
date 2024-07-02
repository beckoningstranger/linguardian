import RegisterForm from "@/components/authentication/RegisterForm";
import getUserOnServer from "@/lib/helperFunctions";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create an account",
};

export default async function RegisterPage() {
  const sessionUser = await getUserOnServer();
  if (!sessionUser) return <RegisterForm />;

  if (!sessionUser.native) redirect(paths.welcomePath());
  if (!sessionUser.isLearning) redirect(paths.welcomePath());

  if (sessionUser.native && sessionUser.isLearning)
    redirect(paths.dashboardLanguagePath(sessionUser.isLearning[0].name));
}
