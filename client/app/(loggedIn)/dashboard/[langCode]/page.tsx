import { notFound } from "next/navigation";

import Dashboard from "@/components/Dashboard/Dashboard";
import { fetchDashboardDataForUser } from "@/lib/api/bff-api";
import { parseLanguageCode } from "@/lib/utils/pages";
import { getUserOnServer } from "@/lib/utils/server";

interface DashboardPageProps {
    params: Promise<{ langCode: string }>;
}
export default async function DashboardPage(props: DashboardPageProps) {
    const params = await props.params;
    const user = await getUserOnServer();
    if (!user) throw new Error("Could not get user, you need to be logged in");

    const dashboardLanguage = parseLanguageCode(params.langCode);
    const allLearnedListNumbers: number[] = Object.values(
        user.learnedLists
    ).flat() as number[];

    const response = await fetchDashboardDataForUser(
        {
            language: dashboardLanguage,
            allLearnedListNumbers,
        },
        user.id
    );

    if (!response.success) notFound();

    const { listsForDashboard, modesAvailableForAllLists } = response.data;

    return (
        <Dashboard
            dashboardLanguage={dashboardLanguage}
            learnedLists={user.learnedLists[dashboardLanguage] ?? []}
            listsForDashboard={listsForDashboard}
            modesAvailableForAllLists={modesAvailableForAllLists}
        />
    );
}
