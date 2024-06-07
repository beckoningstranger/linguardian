import { getSupportedLanguages } from "@/app/actions";
import Search from "@/components/Dictionary/Search";
import { getUserLanguagesWithFlags } from "@/lib/getAllUserLanguages";

interface DictionaryPageProps {
  params?: { language: string };
}

export async function generateStaticParams() {
  const supportedLanguages = (await getSupportedLanguages()) as string[];

  return supportedLanguages?.map((language) => ({ language }));
}

export default async function DictionaryPage({ params }: DictionaryPageProps) {
  const userLanguagesWithFlags = await getUserLanguagesWithFlags();

  return <Search userLanguagesWithFlags={userLanguagesWithFlags} />;
}
