import { notFound } from "next/navigation";

import { Dashboard } from "@/components";
import { fetchDashboardDataForUser } from "@/lib/api/bff-api";
import { SupportedLanguage } from "@/lib/contracts";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { getUserOnServer } from "@/lib/utils/server";

interface DashboardPageProps {
  params?: { language: string };
}
export default async function DashboardPage({ params }: DashboardPageProps) {
  const user = await getUserOnServer();
  const dashboardLanguage = params?.language as SupportedLanguage;
  if (!allSupportedLanguages.includes(dashboardLanguage))
    throw new Error(
      `Malformed URL, ${dashboardLanguage} is not a supported language`
    );
  if (!user) throw new Error("Could not get user, you need to be logged in");

  const allLearnedListNumbers = Object.values(user.learnedLists).flat();

  const response = await fetchDashboardDataForUser(
    {
      language: dashboardLanguage,
      allLearnedListNumbers,
    },
    user.id
  );

  if (!response.success) notFound();

  const { listsForDashboard } = response.data;

  return (
    <Dashboard
      dashboardLanguage={dashboardLanguage}
      learnedLists={user.learnedLists[dashboardLanguage] || []}
      listsForDashboard={listsForDashboard}
    />
  );
}
