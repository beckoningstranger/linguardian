import getUserOnServer from "@/lib/helperFunctions";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

export const metadata = { title: "Signing in..." };

export default async function SignInPage() {
  const sessionUser = await getUserOnServer();
  if (!sessionUser) redirect(paths.rootPath());

  if (!sessionUser.native) redirect(paths.welcomePath());
  if (!sessionUser.isLearning) redirect(paths.welcomePath());

  if (sessionUser.native && sessionUser.isLearning)
    redirect(paths.dashboardLanguagePath(sessionUser.isLearning[0].name));
}
