import { ReactNode } from "react";
import { AuthProvider } from "../Providers";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function Root({ children }: RootLayoutProps) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
      <div id="PortalOutlet" />
    </div>
  );
}
