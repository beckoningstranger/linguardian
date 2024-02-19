import { RxPlus } from "react-icons/rx";

export default function AddNewLanguageOption() {
  return (
    <div
      className={`flex transition-all justify-center items-center rounded-full w-24 h-24 md:w-12 md:h-12 border-2 border-slate-300 hover:scale-125`}
    >
      <RxPlus className="text-6xl md:text-3xl" />
    </div>
  );
}
