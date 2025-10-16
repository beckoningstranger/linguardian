import { ReactNode } from "react";

import { SidebarContextProvider } from "@/context/SidebarContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopM({ children }: RootLayoutProps) {
  return (
    <SidebarContextProvider>
      {children}
      <div id="PortalOutlet" />
    </SidebarContextProvider>
  );
}
