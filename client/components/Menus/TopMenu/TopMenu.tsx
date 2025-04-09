import { getSupportedLanguages } from "@/lib/fetchData";
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
  const allSupportedLanguages = await getSupportedLanguages();
  const background = opacity ? `bg-white/${opacity}` : "bg-white/80";

  return allSupportedLanguages ? (
    <>
      <header>
        <SideBarNavigation />
        <div
          className={cn(
            "relative flex h-[112px] w-full select-none items-center justify-between px-1 tablet:pr-4",
            background
          )}
        >
          <div className={"flex items-center gap-2"}>
            <HamburgerMenu />
            <TopMenuLogo />
          </div>
          <TopMiddleNavigation />
          <MobileMenuContextProvider>
            <LanguageSelectorAndProfileLink
              allSupportedLanguages={allSupportedLanguages}
            />
          </MobileMenuContextProvider>
        </div>
      </header>
    </>
  ) : (
    <div>Connection lost...</div>
  );
}
