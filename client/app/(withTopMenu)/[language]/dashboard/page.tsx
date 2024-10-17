import Dashboard from "@/components/Dashboard/Dashboard";
import {
  getDashboardDataForUser,
  getSupportedLanguages,
} from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import { redirect } from "next/navigation";

export const metadata = { title: "Dashboard" };

interface DashboardPageProps {
  params?: { language: string };
}

export const revalidate = 0;

export async function generateStaticParams() {
  const supportedLanguagesData = await getSupportedLanguages();
  return supportedLanguagesData?.map((lang) => ({ language: lang })) || [];
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
