import { cn } from "@/lib/utils";

interface SpinnerProps {
  big?: boolean;
  mini?: boolean;
  centered?: boolean;
}
export default function Spinner({ big, mini, centered }: SpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "aspect-square animate-spin rounded-full border-gray-400 border-r-gray-300",
        !big && !mini && "border-4 my-4 w-12",
        mini && "border-2 my-1 w-4",
        big && "border-8 my-8 w-32"
      )}
    />
  );

  if (!centered) return spinner;
  return <div className="grid w-full place-items-center">{spinner}</div>;
}
