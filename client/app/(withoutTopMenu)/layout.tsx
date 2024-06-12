import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithoutTopMenu({
  children,
}: RootLayoutProps) {
  return (
    <div>
      {children}
      <div id="PortalOutlet" />
    </div>
  );
}
