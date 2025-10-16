import LayoutWithTopMenu from "@/components/Layout/LayoutWithTopMenu";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function ListLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/ListDetailsPic16.9.webp"
      menuOpacity={90}
    >
      {children}
    </LayoutWithTopMenu>
  );
}
