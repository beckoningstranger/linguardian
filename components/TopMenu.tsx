import Logo from "./Logo";

export default function TopMenu() {
  return (
    <header className="flex justify-between absolute w-full py-3 bg-slate-400 text-xl top-0 select-none">
      <div className="px-3 hover:text-slate-100">
        <Logo />
      </div>
      <div className="invisible md:visible">
        Courses | Dictionaries | Social
      </div>
      <div>Language Selector | User Menu</div>
    </header>
  );
}
