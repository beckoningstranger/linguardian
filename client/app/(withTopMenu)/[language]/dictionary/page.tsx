import {
  checkPassedLanguageAsync,
  findItems,
  getLanguageFeaturesForLanguage,
  getSupportedLanguages,
} from "@/app/actions";
import Search from "@/components/Dictionary/Search";

interface DictionaryPageProps {
  params?: { language: string };
}

export async function generateStaticParams() {
  const supportedLanguages = (await getSupportedLanguages()) as string[];

  return supportedLanguages?.map((language) => ({ language }));
}

export default async function DictionaryPage({ params }: DictionaryPageProps) {
  const passedLanguage = params?.language?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  if (!validPassedLanguage)
    return `No dictionary found for ${params?.language}`;

  const languageFeatures = await getLanguageFeaturesForLanguage(
    validPassedLanguage
  );

  if (languageFeatures)
    return (
      <Search
        validPassedLanguage={validPassedLanguage}
        languageName={languageFeatures.langName}
        findItems={findItems}
      />
    );
}
