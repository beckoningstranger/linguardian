import BackgroundGradient from "@/components/Menus/LandingPageMenu/BackgroundGradient";
import BackgroundPicture from "@/components/Layout/BackgroundPicture";
import LandingPageMenu from "@/components/Menus/LandingPageMenu/LandingPageMenu";
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
