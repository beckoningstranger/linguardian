export default function ItemPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 flex h-[calc(100vh-7.5rem)] flex-col gap-y-2 px-4 md:mx-20">
      {children}
    </div>
  );
}
