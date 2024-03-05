import { RxCrossCircled } from "react-icons/rx";

interface MobileMenuCloseButtonProps {
  close: Function;
}

export default function MobileMenuCloseButton({
  close,
}: MobileMenuCloseButtonProps) {
  return (
    <div
      className="my-4 self-center text-6xl text-slate-600 transition-all hover:text-slate-400 md:hidden"
      onClick={() => close(false)}
    >
      <RxCrossCircled />
    </div>
  );
}
