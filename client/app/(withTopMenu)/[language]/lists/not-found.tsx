import NavigateBackButton from "@/components/NavigateBackButton";

export default async function notFound() {
  return (
    <div className="grid h-96 place-items-center">
      <div className="flex flex-col items-center">
        <div className="text-center w-96">
          <p className="text-2xl mb-4">
            We could not find this list. Sorry! :-/
          </p>

          <p>
            Either the list does not exist yet or there was a problem fetching
            it from the database. Make sure you are logged in and have entered
            the correct URL.
          </p>
        </div>
        <NavigateBackButton className="w-52 mt-4 bg-slate-200 p-4 rounded-md">
          Navigate Back
        </NavigateBackButton>
      </div>
    </div>
  );
}
