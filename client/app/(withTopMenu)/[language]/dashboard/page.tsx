import Dashboard from "@/components/Dashboard/Dashboard";
import { getUserById } from "@/app/actions";
import { redirect } from "next/navigation";
import getUserOnServer from "@/lib/getUserOnServer";
import { SupportedLanguage } from "@/types";
import paths from "@/paths";

export const metadata = { title: "Dashboard" };

interface DashboardPageProps {
  params?: { language: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (!sessionUser.native) redirect(paths.setNativeLanguagePath());
  if (!sessionUser.isLearning) redirect(paths.learnNewLanguagePath());

  if (!user) return "No user";

  if (user && sessionUser.native && sessionUser.isLearning)
    return (
      <Dashboard user={user} language={params?.language as SupportedLanguage} />
    );
}
