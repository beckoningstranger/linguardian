import Dashboard from "@/components/Dashboard";
import { checkPassedLanguageAsync, getUserById } from "@/app/actions";
import { redirect } from "next/navigation";
import getUserOnServer from "@/lib/getUserOnServer";

interface DashboardPageProps {
  searchParams?: { lang: string };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const passedLanguage = searchParams?.lang?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  const sessionUser = await getUserOnServer();
  console.log("SESSION", sessionUser);
  const user = await getUserById(sessionUser.id);

  if (!user?.native) redirect("nativelanguage");
  if (!user?.languages || user?.languages.length === 0)
    redirect("languages/new");

  if (!user) return "No user";

  return (
    <Dashboard
      user={user}
      currentlyActiveLanguage={validPassedLanguage || user.languages[0].code}
    />
  );
}
