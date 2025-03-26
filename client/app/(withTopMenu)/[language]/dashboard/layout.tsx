import TopMenu from "@/components/Menus/TopMenu/TopMenu";
import Image from "next/image";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithTopMenu({ children }: RootLayoutProps) {
  return (
    <div className="relative">
      <Image
        src="/backgrounds/DashboardPic.webp"
        alt="Background Picture showing greenhouses"
        fill
        priority
        className="-z-10 h-auto w-auto object-cover opacity-80"
      />
      <TopMenu opacity={50} />
      {children}
    </div>
  );
}
