import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="my-auto grid h-[calc(100vh-5rem)] w-full place-items-center">
      <div>
        <div className="text-white shadow-lg">Loading dashboard</div>
        <Spinner size="big" />
      </div>
    </div>
  );
}
