export function AllLearningButtonsDesktopContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-2 hidden justify-evenly rounded-md bg-slate-100 py-2 md:flex">
      {children}
    </div>
  );
}

export function AllLearningButtonsMobileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-0 h-24 w-full bg-slate-200 py-4 md:hidden">
      {children}
    </div>
  );
}
