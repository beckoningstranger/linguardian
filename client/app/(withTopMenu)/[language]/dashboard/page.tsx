import Dashboard from "@/components/Dashboard/Dashboard";
import { getSupportedLanguages } from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import paths from "@/paths";
import { SupportedLanguage } from "@/types";
import { redirect } from "next/navigation";

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

  if (!sessionUser.native) redirect(paths.welcomePath());
  if (!sessionUser.isLearning) redirect(paths.welcomePath());

  return <Dashboard language={params?.language as SupportedLanguage} />;
}
