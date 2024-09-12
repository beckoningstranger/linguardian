interface UnitButtonProps {
  label: string;
  percentage: number;
}

export default function UnitButton({ label, percentage }: UnitButtonProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const fillWidth = `${clampedPercentage}%`;

  return (
    <div
      className={`relative flex h-14 w-11/12 items-center justify-center rounded-lg border border-slate-800 py-2 text-center shadow-lg hover:shadow-2xl`}
    >
      <div
        className={`absolute inset-0 z-0 rounded-lg bg-green-300`}
        style={{
          width: fillWidth,
        }}
      />
      <button className={`relative z-10 rounded-lg px-4 py-2`}>{label}</button>
    </div>
  );
}
