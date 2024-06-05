import {
  checkPassedLanguageAsync,
  getAllLanguageFeatures,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ReactNode } from "react";
import { AuthProvider } from "../../Providers";
import getUserOnServer from "@/lib/getUserOnServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linguardian",
  description: "Enrich your vocabulary with the power of spaced repetition",
};

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function RootLayoutWithTopMenu({
  children,
  params,
}: RootLayoutProps) {
  const language = params.language;
  const validPassedLanguage = await checkPassedLanguageAsync(language);
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);
  const allSupportedLanguages = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();

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
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
