import LayoutWithTopMenu from "@/components/Layout/LayoutWithTopMenu";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function DictionaryLayout({ children }: LayoutProps) {
  return (
    <LayoutWithTopMenu
      bgPicture="/backgrounds/DictionaryBackground.webp"
      menuOpacity={90}
      backGroundOpacity="opacity-90"
    >
      {children}
    </LayoutWithTopMenu>
  );
}
