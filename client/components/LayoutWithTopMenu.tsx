import { ReactNode } from "react";
import TopMenu from "./Menus/TopMenu/TopMenu";

interface LayoutWithTopMenuProps {
  children: ReactNode;
  menuOpacity?: 50 | 80 | 90;
  backGroundOpacity?: "opacity-80" | "opacity-90" | "opacity-100";
  bgPicture: string;
}

export default function LayoutWithTopMenu({
  children,
  menuOpacity,
  backGroundOpacity = "opacity-80",
  bgPicture,
}: LayoutWithTopMenuProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div
        className={`fixed top-0 inset-x-0 min-h-screen -z-10 bg-cover bg-center ${backGroundOpacity}`}
        style={{ backgroundImage: `url(${bgPicture})` }}
      />
      <TopMenu opacity={menuOpacity} />
      <main className="flex grow flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
