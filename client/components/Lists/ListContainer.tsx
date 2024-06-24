export default function ListContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="container"
      className="mb-24 flex flex-col md:mx-20 md:mb-0 lg:mx-48 xl:mx-64 2xl:mx-96"
    >
      {children}
    </div>
  );
}
