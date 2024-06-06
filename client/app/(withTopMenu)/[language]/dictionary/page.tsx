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
  const sessionUser = await getUserOnServer();
  const allUserLanguages = (() => {
    const array = sessionUser.isLearning.map((_) => _.name);
    array.push(sessionUser.native.name);
    return array;
  })();

  if (allUserLanguages) return <Search resultLanguages={allUserLanguages} />;
}
