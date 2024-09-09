import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import { getSeperatedUserLanguagesWithFlags } from "@/lib/helperFunctions";
import { LanguageFeatures } from "@/lib/types";

export default async function NewItemPage() {
  const [seperatedUserLanguagesWithFlags] = await Promise.all([
    await getSeperatedUserLanguagesWithFlags(),
  ]);

  const allUserLanguages = Object.values(seperatedUserLanguagesWithFlags)
    .flat()
    .map((lwf) => lwf.name);

  const languageFeaturesForUserLanguagesPromises = allUserLanguages.map(
    (lang) => getLanguageFeaturesForLanguage(lang)
  );

  const languageFeaturesForUserLanguages = (
    await Promise.all(languageFeaturesForUserLanguagesPromises)
  ).filter((features): features is LanguageFeatures => features !== undefined);

  return (
    <EditOrCreateItem
      languageFeaturesForUserLanguages={languageFeaturesForUserLanguages}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
    />
  );
}
