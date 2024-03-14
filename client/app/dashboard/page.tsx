import Dashboard from "@/components/Dashboard";
import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu";
import { SupportedLanguage } from "@/types";
import { getSupportedLanguages, getUserById } from "../actions";

interface DashboardPageProps {
  // searchParams?: { [key: string]: string | string[] | undefined };
  searchParams?: { lang: SupportedLanguage };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  // Make sure passed language is a supported language
  const supportedLanguages = await getSupportedLanguages();
  const passedLanguage = searchParams?.lang?.toUpperCase() as SupportedLanguage;
  const user = await getUserById(1);

  if (
    passedLanguage &&
    supportedLanguages &&
    supportedLanguages.includes(passedLanguage) &&
    user
  ) {
    return (
      <>
        <TopMenu />
        <DashboardContainer>
          <Dashboard user={user} currentlyActiveLanguage={passedLanguage} />
        </DashboardContainer>
      </>
    );
  }
}
