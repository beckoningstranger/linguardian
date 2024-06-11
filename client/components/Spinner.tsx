interface SpinnerProps {
  size: number;
  marginY: number;
}
export default function Spinner({ size, marginY }: SpinnerProps) {
  const renderedSize = "w-" + size;
  const renderedMarginY = "my-" + marginY;

  return (
    <div
      className={`mx-auto aspect-square ${renderedSize} ${renderedMarginY} animate-spin rounded-full border-8 border-gray-400 border-r-gray-300`}
    />
  );
}
