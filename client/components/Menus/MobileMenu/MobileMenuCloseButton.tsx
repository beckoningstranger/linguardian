import { RxCrossCircled } from "react-icons/rx";

interface MobileMenuCloseButtonProps {
  close: Function;
}

export default function MobileMenuCloseButton({
  close,
}: MobileMenuCloseButtonProps) {
  return (
    <div
      className="self-center md:hidden my-4 text-6xl text-slate-600 hover:text-slate-400 transition-all"
      onClick={() => close(false)}
    >
      <RxCrossCircled />
    </div>
  );
}