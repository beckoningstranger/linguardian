import { ArrowUpLeftIcon } from "@heroicons/react/20/solid";
import Logo from "../Logo";

interface LogoWithCloseButtonProps {
  toggleFunction: Function;
}

export default function LogoWithCloseButton({
  toggleFunction,
}: LogoWithCloseButtonProps) {
  return (
    <div className="relative flex h-20 w-full select-none border-black md:hidden">
      <div
        className="grid w-20 place-items-center border-r border-black"
        onClick={(e) => {
          e.stopPropagation();
          toggleFunction();
        }}
      >
        <ArrowUpLeftIcon className="h-10" />
      </div>

      <Logo mobileMenu />
    </div>
  );
}
