import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="my-auto grid h-48 w-full place-items-center">
      <div className="mb-12 text-white">Loading list data...</div>
      <Spinner size="big" />
    </div>
  );
}
