import { getAllLanguageFeatures, getSupportedLanguages } from "@/app/actions";
import PickNewLanguage from "@/components/PickNewLanguage";
import { getUserLanguagesWithFlags } from "@/lib/getAllUserLanguages";
import { LanguageWithFlag } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start learning a new language",
};

export default async function AddNewLanguageToLearn() {
  const supportedLanguages = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();

  const allLanguagesAndFlags = supportedLanguages?.map((lang) => {
    const currentLanguageFeatures = allLanguageFeatures?.filter(
      (langFeat) => langFeat.langCode === lang
    )[0];
    const currentFlag = currentLanguageFeatures?.flagCode;
    return { name: lang, flag: currentFlag } as LanguageWithFlag;
  });

  const allUserLanguagesAndFlags = await getUserLanguagesWithFlags();

  if (allLanguagesAndFlags)
    return (
      <div className="flex h-screen flex-col items-center">
        <div className="mx-auto text-2xl font-semibold">
          Pick a new language to study:
        </div>
        <PickNewLanguage
          allLanguagesAndFlags={allLanguagesAndFlags}
          allUserLanguagesAndFlags={allUserLanguagesAndFlags}
        />
      </div>
    );
}
