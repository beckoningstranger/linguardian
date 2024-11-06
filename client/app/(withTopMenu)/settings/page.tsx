import StopLearningLanguageButton from "@/components/StopLearningLanguageButton";
import { getUserById } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import Link from "next/link";

export default async function SettingsPage() {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  return (
    <div className="mx-2 flex flex-col gap-2">
      {user?.learnedLanguages && user?.learnedLanguages.length > 1 ? (
        user?.learnedLanguages?.map((lang) => (
          <StopLearningLanguageButton language={lang} key={lang.code} />
        ))
      ) : (
        <Link href={paths.learnNewLanguagePath()}>
          Start learning a new language if you want to stop learning{" "}
          {user?.learnedLanguages[0].name}
        </Link>
      )}
    </div>
  );
}
