import Link from "next/link";

import StopLearningLanguageButton from "@/components/StopLearningLanguageButton";
import paths from "@/lib/paths";
import { getUserOnServer } from "@/lib/utils/server";

export default async function SettingsPage() {
  const user = await getUserOnServer();

  return (
    <div className="m-2 flex flex-col gap-2">
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
