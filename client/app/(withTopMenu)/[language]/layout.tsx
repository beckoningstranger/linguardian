import {
  checkPassedLanguageAsync,
  getAllLanguageFeatures,
  getSupportedLanguages,
} from "@/app/actions";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function LayoutWithTopMenuWithLanguageParam({
  children,
  params,
}: RootLayoutProps) {
  const language = params.language;

  const [validPassedLanguage, allSupportedLanguages, allLanguageFeatures] =
    await Promise.all([
      checkPassedLanguageAsync(language),
      getSupportedLanguages(),
      getAllLanguageFeatures(),
    ]);

  let error: string | null = null;
  if (!allSupportedLanguages || !allLanguageFeatures)
    throw new Error(
      "Failed to fetch supported languages and/or language features"
    );
  if (!validPassedLanguage)
    throw new Error(`${language} is not a valid language`);

  return (
    <div>
      {!error &&
        allSupportedLanguages &&
        allLanguageFeatures &&
        validPassedLanguage && <>{children}</>}
      {error}
    </div>
  );
}
