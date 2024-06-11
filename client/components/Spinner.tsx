interface SpinnerProps {
  size?: number;
  marginY?: number | "auto";
}
export default function Spinner({ size = 4, marginY = 2 }: SpinnerProps) {
  const renderedSize = "w-" + size;
  const renderedMarginY = "my-" + marginY;

  return (
    <div
      className={`mx-auto aspect-square ${renderedSize} ${renderedMarginY} animate-spin rounded-full border-8 border-gray-400 border-r-gray-300`}
    />
  );
}
