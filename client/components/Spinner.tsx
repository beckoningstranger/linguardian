interface SpinnerProps {
  size?: "big" | "mini";
}
export default function Spinner({ size }: SpinnerProps) {
  let computedValues = "";
  if (size === undefined) computedValues += "border-4 my-4 w-12";
  if (size === "mini") computedValues += "border-2 my-1 w-4";
  if (size === "big") computedValues += "border-8 my-8 w-32";

  return (
    <div
      className={`aspect-square animate-spin rounded-full border-gray-400 border-r-gray-300 ${computedValues}`}
    />
  );
}
