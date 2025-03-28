import { getSupportedLanguages } from "@/lib/fetchData";
import { MobileMenuContextProvider } from "../../../context/MobileMenuContext";
import HamburgerMenu from "./HamburgerMenu";
import LanguageSelectorAndProfileLink from "./LanguageSelectorAndProfileLink";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import TopMenuLogo from "./TopMenuLogo";
import TopMiddleNavigation from "./TopMiddleNavigation";
import { cn } from "@/lib/helperFunctionsClient";

interface TopMenuProps {
  opacity?: 50 | 80;
}

export default async function TopMenu({ opacity = 80 }: TopMenuProps) {
  const allSupportedLanguages = await getSupportedLanguages();

  return allSupportedLanguages ? (
    <>
      <header>
        <SideBarNavigation />
        <div
          className={cn(
            "relative flex h-[112px] w-full select-none items-center bg-white/80 justify-between px-1 tablet:pr-4",
            opacity === 50 && "bg-white/50"
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
