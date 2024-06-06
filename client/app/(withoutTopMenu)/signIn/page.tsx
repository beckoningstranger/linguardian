import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const sessionUser = await getUserOnServer();
  if (!sessionUser) redirect(paths.rootPath());

  if (!sessionUser.native) redirect(paths.setNativeLanguagePath());
  if (!sessionUser.isLearning) redirect(paths.learnNewLanguagePath());

  if (sessionUser.native && sessionUser.isLearning)
    redirect(paths.dashboardLanguagePath(sessionUser.isLearning[0].name));
}
