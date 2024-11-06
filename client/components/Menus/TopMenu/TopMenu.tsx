import { getSupportedLanguages } from "@/lib/fetchData";
import { MobileMenuContextProvider } from "../../../context/MobileMenuContext";
import HamburgerMenu from "./HamburgerMenu";
import LanguageSelectorAndUserMenu from "./LanguageSelectorAndUserMenu";
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
        <div className="absolute top-0 flex h-20 w-full select-none items-center justify-between bg-slate-300 bg-opacity-25 text-xl">
          <div className={"flex items-center"}>
            <HamburgerMenu />
            <TopMenuLogo />
          </div>
          <TopMiddleNavigation />
          <MobileMenuContextProvider>
            <LanguageSelectorAndUserMenu
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
