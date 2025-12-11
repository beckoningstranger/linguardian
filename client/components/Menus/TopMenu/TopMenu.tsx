import LanguageSelectorAndProfileLink from "@/components/Menus/TopMenu/LanguageSelectorAndProfileLink";
import SideBarNavigation from "@/components/Menus/TopMenu/Sidebar/SideBarNavigation";
import TopMenuLogo from "@/components/Menus/TopMenu/TopMenuLogo";
import TopMiddleNavigation from "@/components/Menus/TopMenu/TopMiddleNavigation";
import HamburgerMenu from "@/components/Menus/TopMenu/HamburgerMenu";
import { cn } from "@/lib/utils";

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
          "z-10 flex h-[112px] w-full select-none items-center justify-between",
          background
        )}
      >
        <div className={"flex items-center gap-2"} id="HamburgerMenu|Logo">
          <HamburgerMenu />
          <TopMenuLogo />
        </div>
        <TopMiddleNavigation />
        <LanguageSelectorAndProfileLink />
      </div>
    </header>
  );
}
