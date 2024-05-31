import {
  checkPassedLanguageAsync,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
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
  const user = await getUserById(sessionUser.id);

  const passedLanguage = params?.language?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);

  if (validPassedLanguage)
    return (
      <div>Dictionary {validPassedLanguage}: Nothing to see here just yet.</div>
    );
  return `No dictionary found for ${params?.language}`;
}
