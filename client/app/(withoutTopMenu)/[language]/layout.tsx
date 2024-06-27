import { getSupportedLanguages } from "@/lib/fetchData";
import { checkPassedLanguageAsync } from "@/lib/helperFunctions";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function LayoutWithoutTopMenuWithLanguageParam({
  children,
  params,
}: RootLayoutProps) {
  const language = params.language;

  const [validPassedLanguage, allSupportedLanguages] = await Promise.all([
    checkPassedLanguageAsync(language),
    getSupportedLanguages(),
  ]);

  if (!allSupportedLanguages)
    throw new Error("Failed to fetch supported languages");
  if (!validPassedLanguage)
    throw new Error(`${language} is not a valid language`);

  return children;
}
