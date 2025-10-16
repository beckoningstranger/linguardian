import NavigateBackButton from "@/components/NavigateBackButton";

export default async function notFound() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col justify-center gap-4">
        <div className="text-center text-2xl">Page not found :-/</div>
        <NavigateBackButton />
      </div>
    </div>
  );
}
