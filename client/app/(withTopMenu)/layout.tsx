import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";
import { getAllLanguageFeatures, getSupportedLanguages } from "@/lib/fetchData";
import { ReactNode } from "react";

import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import { getUserOnServer } from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  const [allSupportedLanguages, allLanguageFeatures, sessionUser] =
    await Promise.all([
      getSupportedLanguages(),
      getAllLanguageFeatures(),
      getUserOnServer(),
    ]);

  if (!allSupportedLanguages || !allLanguageFeatures)
    throw new Error(
      "Connection lost, could not get supported languages and/or language features"
    );
  if (!sessionUser) throw new Error("Failed to get session user");

  const initialActiveLanguage = sessionUser.isLearning
    ? sessionUser.isLearning[0].name
    : ("DE" as SupportedLanguage);

  return (
    <>
      <ActiveLanguageProvider initialActiveLanguage={initialActiveLanguage}>
        <TopMenu
          allSupportedLanguages={allSupportedLanguages}
          allLanguageFeatures={allLanguageFeatures}
        />
      </ActiveLanguageProvider>
      <DashboardContainer>
        {children}
        <div id="PortalOutlet" />
      </DashboardContainer>
    </>
  );
}
