import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="my-auto grid h-screen w-full place-items-center">
      <Spinner size={24} marginY={"auto"} />
    </div>
  );
}
