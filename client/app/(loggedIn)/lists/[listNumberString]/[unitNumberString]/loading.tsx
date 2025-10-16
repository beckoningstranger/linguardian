import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="grid min-h-[calc(100vh-112px)] place-items-center bg-white/80">
      <div>
        <div className="text-clgm text-black">Loading unit data...</div>
        <Spinner big centered />
      </div>
    </div>
  );
}
