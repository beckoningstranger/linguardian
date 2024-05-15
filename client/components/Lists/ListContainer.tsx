export default function ListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="container" className="md:mx-20 lg:mx-48 xl:mx-64 2xl:mx-96">
      {children}
    </div>
  );
}
