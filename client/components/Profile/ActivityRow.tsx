import Image from "next/image";

interface ActivityRowProps {
  mode: "Planted" | "Reviewed" | "Mnemonics";
  amount: number;
}
export default function ActivityRow({
  mode,
  amount,
}: ActivityRowProps) {
  const config = {
    Planted: { icon: "/icons/Planted.svg", title: "Planted" },
    Reviewed: { icon: "/icons/Reviewed.svg", title: "Reviewed" },
    Mnemonics: {
      icon: "/icons/Mnemonics.svg",
      title: "Mnemonics created",
    },
  };

  return (
    <div className="flex w-full items-center justify-between text-cxlm text-black">
      <div className="flex items-center gap-2">
        <Image
          src={config[mode].icon}
          alt={mode + " icon"}
          width={56}
          height={56}
        />
        <p className="leading-tight">{config[mode].title}</p>
      </div>

      <p className="text-cxlb">{amount}</p>
    </div>
  );
}
