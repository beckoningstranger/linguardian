import Image from "next/image";
import { ReactNode } from "react";

import TopMenu from "@/components/Menus/TopMenu/TopMenu";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  return (
    <div className="relative">
      <Image
        src="/backgrounds/ListStorePic.webp"
        alt="Background Picture showing greenhouses"
        fill
        priority
        className="-z-10 h-auto w-auto object-cover opacity-70"
      />
      <TopMenu opacity={80} />
      <div className="flex min-h-[calc(100vh-112px)] flex-col">{children}</div>
    </div>
  );
}
