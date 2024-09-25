import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";
import { ReactNode } from "react";

import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import { SidebarContextProvider } from "@/context/SidebarContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  return (
    <>
      <ActiveLanguageProvider>
        <SidebarContextProvider>
          <TopMenu />
        </SidebarContextProvider>
      </ActiveLanguageProvider>
      <DashboardContainer>
        {children}
        <div id="PortalOutlet" />
      </DashboardContainer>
    </>
  );
}
