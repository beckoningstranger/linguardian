import Flag from "react-world-flags";

interface CurrentlyActiveFlagProps {
  currentlyActiveLanguage: string;
  handleFlagSelected: Function;
}

export default function CurrentlyActiveFlag({
  currentlyActiveLanguage,
  handleFlagSelected,
}: CurrentlyActiveFlagProps) {
  return (
    <Flag
      code={currentlyActiveLanguage!}
      onClick={() => handleFlagSelected(currentlyActiveLanguage!)}
      className={`rounded-full object-cover w-[80px] h-[80px] md:w-[50px] md:h-[50px] m-0 border-2 border-slate-300`}
    />
  );
}
