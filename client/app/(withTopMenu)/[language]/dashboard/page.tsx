import Dashboard from "@/components/Dashboard/Dashboard";
import { getUserById } from "@/app/actions";
import { redirect } from "next/navigation";
import getUserOnServer from "@/lib/getUserOnServer";
import { SupportedLanguage } from "@/types";

interface DashboardPageProps {
  params?: { language: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (!user?.native) redirect("/nativelanguage");
  if (!user?.languages || user?.languages.length === 0)
    redirect("languages/new");

  if (!user) return "No user";

  return (
    <Dashboard user={user} language={params?.language as SupportedLanguage} />
  );
}
