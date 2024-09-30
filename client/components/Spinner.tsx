interface SpinnerProps {
  size?: "big" | "mini";
  centered?: boolean;
}
export default function Spinner({ size, centered }: SpinnerProps) {
  let computedValues = "";
  if (size === undefined) computedValues += "border-4 my-4 w-12";
  if (size === "mini") computedValues += "border-2 my-1 w-4";
  if (size === "big") computedValues += "border-8 my-8 w-32";

  const spinner = (
    <div
      className={`aspect-square animate-spin rounded-full border-gray-400 border-r-gray-300 ${computedValues}`}
    />
  );

  if (centered)
    return <div className="grid w-full place-items-center">{spinner}</div>;

  return spinner;
}
