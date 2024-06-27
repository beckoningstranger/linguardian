import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";
import { getAllLanguageFeatures, getSupportedLanguages } from "@/lib/fetchData";
import { ReactNode } from "react";

import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import getUserOnServer from "@/lib/helperFunctions";

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

  return (
    <>
      <ActiveLanguageProvider
        initialActiveLanguage={sessionUser.isLearning[0].name}
      >
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
