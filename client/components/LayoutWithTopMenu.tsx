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
  const bgOpacityClass = "opacity-" + backGroundOpacity;
  return (
    <>
      <div
        className={`fixed inset-0 -z-10 bg-cover bg-center ${backGroundOpacity}`}
        style={{ backgroundImage: `url(${bgPicture})` }}
      />
      <TopMenu opacity={menuOpacity} />
      <div className="flex min-h-[calc(100vh-112px)] flex-col">{children}</div>
    </>
  );
}
