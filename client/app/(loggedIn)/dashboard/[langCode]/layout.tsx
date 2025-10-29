import LayoutWithTopMenu from "@/components/Layout/LayoutWithTopMenu";
import { ReactNode } from "react";

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
