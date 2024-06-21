import Dashboard from "@/components/Dashboard/Dashboard";
import { redirect } from "next/navigation";
import getUserOnServer from "@/lib/getUserOnServer";
import { SupportedLanguage } from "@/types";
import paths from "@/paths";
import { getSupportedLanguages } from "@/lib/fetchData";

export const metadata = { title: "Dashboard" };

interface DashboardPageProps {
  params?: { language: string };
}

export async function generateStaticParams() {
  const supportedLanguagesData = await getSupportedLanguages();
  if (!supportedLanguagesData)
    throw new Error("Could not get supported languages");
  return supportedLanguagesData.map((lang) => ({ language: lang }));
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const sessionUser = await getUserOnServer();

  if (!sessionUser.native) redirect(paths.setNativeLanguagePath());
  if (!sessionUser.isLearning) redirect(paths.learnNewLanguagePath());

  return <Dashboard language={params?.language as SupportedLanguage} />;
}
