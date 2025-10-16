import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="grid h-screen place-items-center bg-white/80">
      <div>
        <p className="text-clgm text-black">Loading dashboard...</p>
        <Spinner big centered />
      </div>
    </div>
  );
}
