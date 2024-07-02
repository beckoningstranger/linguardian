export default function ItemPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative my-2 flex h-[calc(100vh-6.5rem)] flex-col gap-y-2 px-4">
      {children}
    </div>
  );
}
