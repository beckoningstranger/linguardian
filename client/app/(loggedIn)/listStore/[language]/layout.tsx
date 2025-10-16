import LayoutWithTopMenu from "@/components/Layout/LayoutWithTopMenu";
import { ReactNode } from "react";

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
