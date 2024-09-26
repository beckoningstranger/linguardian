import StopLearningLanguageButton from "@/components/StopLearningLanguageButton";
import { getUserByUsernameSlug } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctions";

export default async function SettingsPage() {
  const [sessionUser] = await Promise.all([getUserOnServer()]);

  const [user] = await Promise.all([
    getUserByUsernameSlug(sessionUser.usernameSlug),
  ]);

  return (
    <div className="mx-2 flex flex-col gap-2">
      {user?.languages.map((lang) => (
        <StopLearningLanguageButton
          langCode={lang.code}
          langName={lang.name}
          key={lang.code}
        />
      ))}
    </div>
  );
}
