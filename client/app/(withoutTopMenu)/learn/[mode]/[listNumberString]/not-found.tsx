import NavigateBackButton from "@/components/NavigateBackButton";

export default async function notFound() {
  return (
    <div className="grid h-96 place-items-center">
      <div className="flex flex-col items-center">
        <div className="w-96 text-center">
          <p className="mb-4 text-2xl">
            We could not start a learning session. Sorry! :-/
          </p>

          <p>
            Either the list does not exist yet or there was a problem fetching
            data from the database. Make sure you are logged in and have entered
            the correct URL.
          </p>
        </div>
        <NavigateBackButton />
      </div>
    </div>
  );
}
