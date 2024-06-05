export default function ItemPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex justify-between px-4 py-2">{children}</div>;
}
