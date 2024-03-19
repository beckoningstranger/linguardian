import Dashboard from "@/components/Dashboard";
import { SupportedLanguage } from "@/types";
import { getSupportedLanguages, getUserById } from "../../../actions";
import { checkPassedLanguage } from "../layout";

interface DashboardPageProps {
  // searchParams?: { [key: string]: string | string[] | undefined };
  searchParams?: { lang: SupportedLanguage };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  // Make sure passed language is a supported language
  const supportedLanguages = await getSupportedLanguages();
  const validPassedLanguage = await checkPassedLanguage(
    searchParams?.lang?.toUpperCase()
  );
  const user = await getUserById(1);

  if (validPassedLanguage && user)
    return (
      <Dashboard user={user} currentlyActiveLanguage={validPassedLanguage} />
    );
  if (user)
    return (
      <Dashboard
        user={user}
        currentlyActiveLanguage={user?.languages[0].code}
      />
    );
  if (!user) return "No user";
}
