import NavigateBackButton from "@/components/NavigateBackButton";

export default async function notFound() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col justify-center">
        <div className="text-center text-2xl">Page not found :-/</div>
        <NavigateBackButton className="w-52 mt-4 bg-slate-200 p-4 rounded-md">
          Navigate Back
        </NavigateBackButton>
      </div>
    </div>
  );
}
