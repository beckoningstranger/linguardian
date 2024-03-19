import { ReactNode } from "react";
import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";

interface AppLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <MobileMenuContextProvider>{children}</MobileMenuContextProvider>
      <div id="PortalOutlet" />
    </>
  );
}
