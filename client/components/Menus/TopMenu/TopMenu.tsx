import { getSupportedLanguages } from "@/lib/fetchData";
import { MobileMenuContextProvider } from "../../../context/MobileMenuContext";
import HamburgerMenu from "./HamburgerMenu";
import LanguageSelectorAndProfileLink from "./LanguageSelectorAndProfileLink";
import SideBarNavigation from "./Sidebar/SideBarNavigation";
import TopMenuLogo from "./TopMenuLogo";
import TopMiddleNavigation from "./TopMiddleNavigation";

interface TopMenuProps {}

export default async function TopMenu({}: TopMenuProps) {
  const allSupportedLanguages = await getSupportedLanguages();

  return allSupportedLanguages ? (
    <>
      <header>
        <SideBarNavigation />
        <div className="relative flex h-[112px] w-full select-none items-center justify-between bg-white/50 px-1 tablet:px-4">
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
