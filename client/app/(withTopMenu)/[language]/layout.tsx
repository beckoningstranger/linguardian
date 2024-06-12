import {
  checkPassedLanguageAsync,
  getAllLanguageFeatures,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

import { ReactNode } from "react";
import { AuthProvider } from "../../Providers";
import getUserOnServer from "@/lib/getUserOnServer";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function RootLayoutWithTopMenu({
  children,
  params,
}: RootLayoutProps) {
  const language = params.language;
  const sessionUser = await getUserOnServer();

  const [
    validPassedLanguage,
    user,
    allSupportedLanguages,
    allLanguageFeatures,
  ] = await Promise.all([
    checkPassedLanguageAsync(language),
    getUserById(sessionUser.id),
    getSupportedLanguages(),
    getAllLanguageFeatures(),
  ]);

  let error: string | null = null;
  if (
    !user ||
    !allSupportedLanguages ||
    !allLanguageFeatures ||
    !validPassedLanguage
  )
    error = "Connection lost";
  if (!validPassedLanguage)
    error = `${params?.language} is not a valid language`;

  return (
    <div>
      {!error &&
        user &&
        allSupportedLanguages &&
        allLanguageFeatures &&
        validPassedLanguage && (
          <AuthProvider>
            <TopMenu
              user={user}
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
