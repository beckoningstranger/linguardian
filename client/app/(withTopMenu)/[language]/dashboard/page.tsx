import Dashboard from "../../../../components/Dashboard/Dashboard";
import { getDashboardDataForUser } from "../../../../lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "../../../../lib/paths";
import {
  LearningDataForLanguage,
  PopulatedList,
  SupportedLanguage,
} from "@/lib/types";
import { redirect } from "next/navigation";
import Image from "next/image";

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
    <div className="relative flex min-h-[calc(100vh-112px)] justify-center">
      <Image
        src="/backgrounds/DashboardPic.webp"
        alt="Background Picture showing greenhouses"
        fill
        priority
        className="-z-10 h-auto w-auto object-cover opacity-80"
      />
      <Dashboard
        language={params?.language as SupportedLanguage}
        learnedLists={learnedLists[params?.language as SupportedLanguage] || []}
        populatedLists={lists}
        learningDataForLanguage={learningDataForLanguage}
        userNative={user.native.code}
      />
    </div>
  );
}
