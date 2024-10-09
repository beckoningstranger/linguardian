import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

export const metadata = { title: "Signing in..." };

export default async function SignInPage() {
  const user = await getUserOnServer();
  if (!user) redirect(paths.rootPath());

  if (!user.native || !user.learnedLanguages || !user.learnedLanguages[0])
    redirect(paths.welcomePath());

  redirect(paths.dashboardLanguagePath(user.learnedLanguages[0].code));
}
