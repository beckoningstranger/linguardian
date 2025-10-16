import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="grid place-items-center">
        <Spinner big />
      </div>
    </div>
  );
}
