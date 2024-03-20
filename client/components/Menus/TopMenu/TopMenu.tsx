import {
  getAllLanguageFeatures,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import TopMenuContent from "./TopMenuContent";

export default async function TopMenu() {
  const user = await getUserById(1);
  const allSupportedLanguages = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();
  if (user && allSupportedLanguages && allLanguageFeatures)
    return (
      <TopMenuContent
        user={user}
        allSupportedLanguages={allSupportedLanguages}
        allLanguageFeatures={allLanguageFeatures}
      />
    );
  return "No User or connection lost.";
}
