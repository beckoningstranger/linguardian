import { ReactNode } from "react";

import LayoutWithTopMenu from "@/components/LayoutWithTopMenu";

interface LayoutProps {
  children: ReactNode;
}

export default async function ProfileLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/ListDetailsPic16.9.webp"
      menuOpacity={90}
    >
      {children}
    </LayoutWithTopMenu>
  );
}
