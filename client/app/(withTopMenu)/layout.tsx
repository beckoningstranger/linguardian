import { ReactNode } from "react";

import { ActiveLanguageProvider } from "@/context/ActiveLanguageContext";
import { SidebarContextProvider } from "@/context/SidebarContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  return (
    <ActiveLanguageProvider>
      <SidebarContextProvider>
        {children}
        <div id="PortalOutlet" />
      </SidebarContextProvider>
    </ActiveLanguageProvider>
  );
}
