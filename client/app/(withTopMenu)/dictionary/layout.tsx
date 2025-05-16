import { ReactNode } from "react";

import LayoutWithTopMenu from "@/components/LayoutWithTopMenu";

interface LayoutProps {
  children: ReactNode;
}

export default async function DictionaryLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/DictionaryBackground.webp"
      menuOpacity={80}
      backGroundOpacity="opacity-90"
    >
      {children}
    </LayoutWithTopMenu>
  );
}
