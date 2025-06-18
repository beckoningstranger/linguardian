interface ActivityChartProps {}

export default function ActivityChart({}: ActivityChartProps) {
  const day = {
    date: new Date(),
    planted: 2,
    reviewed: 28,
    mnemonicsCreated: 5,
  };
  const stats = [];

  return (
    <div className="w-full rounded-md bg-white/90 px-8 py-4">
      <p className="font-serif text-hlg">Activity Chart</p>
    </div>
  );
}
