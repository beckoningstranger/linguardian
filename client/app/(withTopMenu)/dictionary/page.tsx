import { checkPassedLanguageAsync, getUserById } from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";

interface DictionaryPageProps {
  searchParams?: { lang: string };
}

export default async function DictionaryPage({
  searchParams,
}: DictionaryPageProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  const passedLanguage = searchParams?.lang?.toUpperCase();
  const validPassedLanguage =
    (await checkPassedLanguageAsync(passedLanguage)) || user?.languages[0].code;

  if (validPassedLanguage)
    return (
      <div>Dictionary {validPassedLanguage}: Nothing to see here just yet.</div>
    );
  return "Something went wrong, are you logged in?";
}
