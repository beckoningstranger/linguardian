"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import useGlobalContext from "../app/hooks/useGlobalContext";

export default function Logo() {
  const { toggleSidebar } = useGlobalContext();
  return (
    <div
      className="flex gap-2 w-full justify-center items-center"
      onClick={toggleSidebar}
    >
      <div>
        <RxHamburgerMenu />
      </div>
      <div className="invisible md:visible">Linguardian</div>
    </div>
  );
}
