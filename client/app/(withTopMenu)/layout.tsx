import { getAllLanguageFeatures, getSupportedLanguages } from "@/app/actions";
import { ReactNode } from "react";

import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  const [allSupportedLanguages, allLanguageFeatures] = await Promise.all([
    getSupportedLanguages(),
    getAllLanguageFeatures(),
  ]);

  if (!allSupportedLanguages || !allLanguageFeatures)
    throw new Error(
      "Connection lost, could not get supported languages and/or language features"
    );

  return (
    <>
      <TopMenu
        allSupportedLanguages={allSupportedLanguages}
        allLanguageFeatures={allLanguageFeatures}
      />
      <DashboardContainer>
        {children}
        <div id="PortalOutlet" />
      </DashboardContainer>
    </>
  );
}
