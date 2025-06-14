import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="grid h-screen place-items-center bg-white/80">
      <div>
        <div className="text-clgm text-black">Loading list data...</div>
        <Spinner size="big" centered />
      </div>
    </div>
  );
}
