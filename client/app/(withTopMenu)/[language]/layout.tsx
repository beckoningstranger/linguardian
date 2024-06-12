import {
  checkPassedLanguageAsync,
  getAllLanguageFeatures,
  getSupportedLanguages,
} from "@/app/actions";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

import { ReactNode } from "react";
import { AuthProvider } from "../../Providers";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function RootLayoutWithTopMenu({
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
  if (!allSupportedLanguages || !allLanguageFeatures || !validPassedLanguage)
    error = "Connection lost";
  if (!validPassedLanguage)
    error = `${params?.language} is not a valid language`;

  return (
    <div>
      {!error &&
        allSupportedLanguages &&
        allLanguageFeatures &&
        validPassedLanguage && (
          <AuthProvider>
            <TopMenu
              allSupportedLanguages={allSupportedLanguages}
              allLanguageFeatures={allLanguageFeatures}
              language={validPassedLanguage}
            />
            <DashboardContainer>
              {children}
              <div id="PortalOutlet" />
            </DashboardContainer>
          </AuthProvider>
        )}
      {error}
    </div>
  );
}
