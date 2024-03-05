import { RxCrossCircled } from "react-icons/rx";

export default function MobileMenuCloseButton() {
  return (
    <div className="my-4 self-center text-6xl text-slate-600 transition-all hover:text-slate-400 md:hidden">
      <RxCrossCircled />
    </div>
  );
}
