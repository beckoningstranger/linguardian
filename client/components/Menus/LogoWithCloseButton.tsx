import { ArrowUpLeftIcon } from "@heroicons/react/20/solid";
import Logo from "../Logo";

interface LogoWithCloseButtonProps {
  toggleFunction: Function;
}

export default function LogoWithCloseButton({
  toggleFunction,
}: LogoWithCloseButtonProps) {
  return (
    <div className="relative md:hidden">
      <div
        className="absolute left-0 grid h-20 w-20 place-items-center border-r border-black"
        onClick={(e) => {
          e.stopPropagation();
          toggleFunction();
        }}
      >
        <ArrowUpLeftIcon className="h-10" />
      </div>
      <Logo />
    </div>
  );
}
