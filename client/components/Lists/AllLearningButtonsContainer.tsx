export default function AllLearningButtonsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-2 flex justify-evenly rounded-md bg-slate-100 py-2">
      {children}
    </div>
  );
}
