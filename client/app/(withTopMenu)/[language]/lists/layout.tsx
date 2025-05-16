import { ReactNode } from "react";

import LayoutWithTopMenu from "@/components/LayoutWithTopMenu";

interface LayoutProps {
  children: ReactNode;
}

export default async function ListStoreLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/ListStorePic.webp"
      menuOpacity={80}
    >
      {children}
    </LayoutWithTopMenu>
  );
}
