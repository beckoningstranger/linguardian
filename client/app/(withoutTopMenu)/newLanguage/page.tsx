import NoMoreLanguagesToLearn from "@/components/NoMoreLanguagesToLearn";
import PickNewLanguage from "@/components/PickNewLanguage";
import { getAllLanguageFeatures } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctions";
import { LanguageWithFlag } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn a new language",
};

export default async function AddNewLanguageToLearn() {
  const allLanguageFeatures = await getAllLanguageFeatures();
  if (!allLanguageFeatures) throw new Error("Failed to get language features");

  const allUserLanguages = await getAllUserLanguages();

  const allAvailableLanguageFeatures = allLanguageFeatures?.filter(
    ({ langCode }) => !allUserLanguages.includes(langCode)
  );

  const languagesAndFlags = allAvailableLanguageFeatures?.map(
    (langFeat) =>
      ({
        name: langFeat.langCode,
        flag: langFeat.flagCode,
      } as LanguageWithFlag)
  );

  const renderedFlags = languagesAndFlags.map((langAndFlag) => (
    <PickNewLanguage
      key={langAndFlag.name}
      languageAndFlag={langAndFlag}
      languageName={
        allAvailableLanguageFeatures.find(
          (features) => features.langCode === langAndFlag.name
        )?.langName
      }
    />
  ));

  if (allAvailableLanguageFeatures.length === 0)
    return <NoMoreLanguagesToLearn />;
  return (
    <div className="flex h-screen flex-col items-center">
      <div className="mx-auto text-2xl font-semibold">
        Pick a new language to study:
      </div>
      <div className="grid grid-cols-2 gap-5">{renderedFlags}</div>
    </div>
  );
}
