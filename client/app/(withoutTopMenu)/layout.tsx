import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithoutTopMenu({
  children,
}: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col" id="LayoutWithoutTopMenu">
      {children}
      <div id="PortalOutlet" />
    </div>
  );
}
