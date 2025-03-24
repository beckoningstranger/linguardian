import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";
import { ReactNode } from "react";

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
      <div>
        {children}
        <div id="PortalOutlet" />
      </div>
    </>
  );
}
