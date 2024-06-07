import { getSupportedLanguages } from "@/app/actions";
import Search from "@/components/Dictionary/Search";
import getUserOnServer from "@/lib/getUserOnServer";

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

async function getUserLanguagesWithFlags() {
  const sessionUser = await getUserOnServer();
  const userLanguagesWithFlags = sessionUser.isLearning;
  userLanguagesWithFlags.push(sessionUser.native);
  return userLanguagesWithFlags;
}
