export function AllLearningButtonsContainer({
  mode,
  children,
}: {
  mode: "mobile" | "desktop" | "dashboard";
  children: React.ReactNode;
}) {
  switch (mode) {
    case "desktop":
      return (
        <div className="m-2 hidden justify-evenly rounded-md bg-slate-100 py-2 sm:flex">
          {children}
        </div>
      );
    case "mobile":
      return (
        <div className="fixed bottom-0 z-40 h-24 w-full bg-slate-200 py-4 sm:hidden">
          {children}
        </div>
      );
    case "dashboard":
      return (
        <div className="m-2 grid grid-cols-3 place-items-center gap-2 md:h-full md:grid-cols-2">
          {children}
        </div>
      );
  }
}
