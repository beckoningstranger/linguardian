import { RxCrossCircled } from "react-icons/rx";

export default function MobileMenuCloseButton() {
  return (
    <div className="text-5xl text-slate-500 transition-all hover:text-slate-400 md:hidden">
      <RxCrossCircled />
    </div>
  );
}
