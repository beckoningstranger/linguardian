import { Metadata } from "next";

import { NoMoreLanguagesToLearn, PickNewLanguage } from "@/components";
import { allLanguageFeatures } from "@/lib/siteSettings";
import { getUserOnServer } from "@/lib/utils/server";

export const metadata: Metadata = {
  title: "Learn a new language",
};

export default async function AddNewLanguageToLearn() {
  const user = await getUserOnServer();
  const allUserLanguages = [user?.native, ...(user?.learnedLanguages ?? [])];

  const allAvailableLanguageFeatures = allLanguageFeatures.filter(
    ({ langCode }) =>
      !allUserLanguages.map((lang) => lang?.code).includes(langCode)
  );

  const languagesAndFlagsWithNames = allAvailableLanguageFeatures?.map(
    (langFeat) => ({
      code: langFeat.langCode,
      flag: langFeat.flagCode,
      name: langFeat.langName,
    })
  );

  const renderedFlags = languagesAndFlagsWithNames?.map(
    (langAndFlagWithName, index) => (
      <PickNewLanguage key={index} newLanguage={langAndFlagWithName} />
    )
  );

  if (allAvailableLanguageFeatures?.length === 0)
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
