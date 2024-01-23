"use client";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";
import HamburgerMenu from "./HamburgerMenu";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import Logo from "./Logo";

export default function TopMenu() {
  const { toggleSidebar } = useGlobalContext();
  return (
    <header className="flex justify-between absolute w-full h-20 py-14 md:py-0 bg-slate-200 bg-opacity-25 text-xl top-0 select-none items-center">
      <div
        className="flex gap-2 justify-center items-center w-20 md:w-48 mx-2"
        onClick={toggleSidebar}
      >
        <HamburgerMenu />
        <Logo classes="hidden md:block" />
      </div>
      <div className="hidden md:block">Courses | Dictionaries | Social</div>
      <div className="md:hidden">
        <LanguageSelector />
      </div>
      <div className="flex justify-between gap-2 items-center mx-2">
        <LanguageSelector classes="hidden md:block" /> <UserMenu />
      </div>
    </header>
  );
}
