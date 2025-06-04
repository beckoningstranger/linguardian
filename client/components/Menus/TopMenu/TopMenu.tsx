import { cn } from "@/lib/helperFunctionsClient";
import { MobileMenuContextProvider } from "../../../context/MobileMenuContext";
import HamburgerMenu from "./HamburgerMenu";
import LanguageSelectorAndProfileLink from "./LanguageSelectorAndProfileLink";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import TopMenuLogo from "./TopMenuLogo";
import TopMiddleNavigation from "./TopMiddleNavigation";

interface TopMenuProps {
  opacity?: 50 | 80 | 90;
}

export default async function TopMenu({ opacity }: TopMenuProps) {
  const background = opacity ? `bg-white/${opacity}` : "bg-white/80";

  return (
    <header id="TopMenu">
      <SideBarNavigation />
      <div
        id="TopMenuMain"
        className={cn(
          "relative flex h-[112px] w-full select-none items-center justify-between",
          background
        )}
      >
        <div className={"flex items-center gap-2"} id="HamburgerMenu|Logo">
          <HamburgerMenu />
          <TopMenuLogo />
        </div>
        <TopMiddleNavigation />
        <MobileMenuContextProvider>
          <LanguageSelectorAndProfileLink />
        </MobileMenuContextProvider>
      </div>
    </header>
  );
}
