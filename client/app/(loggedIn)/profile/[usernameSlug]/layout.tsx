import { ReactNode } from "react";

import { LayoutWithTopMenu } from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";

interface LayoutProps {
  children: ReactNode;
}

export default async function ProfileLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/DashboardPic.webp"
      menuOpacity={90}
    >
      <MobileMenuContextProvider>{children}</MobileMenuContextProvider>
    </LayoutWithTopMenu>
  );
}
