import { ReactNode } from "react";

import LayoutWithTopMenu from "@/components/LayoutWithTopMenu";

interface LayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/DashboardPic.webp"
      menuOpacity={50}
      backGroundOpacity="opacity-80"
    >
      {children}
    </LayoutWithTopMenu>
  );
}
