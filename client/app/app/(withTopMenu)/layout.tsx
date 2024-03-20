import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <TopMenu />
      <DashboardContainer>
        {children}
        <div id="PortalOutlet" />
      </DashboardContainer>
    </>
  );
}
