import { redirect } from "next/navigation";

import { getUserOnServer } from "@/lib/helperFunctionsServer";
import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import Dashboard from "../../../../components/Dashboard/Dashboard";
import { getDashboardDataForUser } from "../../../../lib/fetchData";
import paths from "../../../../lib/paths";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  params?: { language: string };
}
export default async function DashboardPage({ params }: DashboardPageProps) {
  const user = await getUserOnServer();
  if (!user.native || !user.learnedLanguages) redirect(paths.welcomePath());

  const { learnedLists, learningDataForLanguage, lists } =
    (await getDashboardDataForUser(
      user.id,
      params?.language as SupportedLanguage
    )) as {
      learnedLists: Partial<Record<SupportedLanguage, number[]>>;
      learningDataForLanguage: LearningDataForLanguage;
      lists: PopulatedList[];
    };

  return (
    <Dashboard
      language={params?.language as SupportedLanguage}
      learnedLists={learnedLists[params?.language as SupportedLanguage] || []}
      populatedLists={lists}
      learningDataForLanguage={learningDataForLanguage}
      userNative={user.native.code}
    />
  );
}
