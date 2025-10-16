import {
  BackgroundGradient,
  BackgroundPicture,
  LandingPageMenu,
} from "@/components";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function LayoutWithoutTopMenu({
  children,
}: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col" id="LayoutWithoutTopMenu">
      <BackgroundPicture bgPicture="/backgrounds/landingPageBackground.webp" />
      <BackgroundGradient>
        <LandingPageMenu />
        {children}
      </BackgroundGradient>
    </div>
  );
}
