import Dashboard from "@/components/Dashboard";
import { checkPassedLanguageAsync, getUserById } from "../../../actions";

interface DashboardPageProps {
  searchParams?: { lang: string };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const passedLanguage = searchParams?.lang?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  const user = await getUserById(1);

  if (user)
    return (
      <Dashboard
        user={user}
        currentlyActiveLanguage={validPassedLanguage || user.languages[0].code}
      />
    );
  if (!user) return "No user";
}
