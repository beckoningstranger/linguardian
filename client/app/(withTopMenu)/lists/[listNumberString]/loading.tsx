import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="grid size-full place-items-center bg-white/80">
      <div className="grid place-items-center">
        <div className="mb-12 text-clgm text-black">Loading list data...</div>
        <Spinner size="big" />
      </div>
    </div>
  );
}
