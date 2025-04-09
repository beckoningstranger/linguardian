import { ReactNode } from "react";

import TopMenu from "@/components/Menus/TopMenu/TopMenu";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-[url('/backgrounds/DashboardPic.webp')] bg-cover bg-center opacity-80" />
      <TopMenu opacity={50} />
      <div className="flex min-h-[calc(100vh-112px)] flex-col">{children}</div>
    </div>
  );
}
