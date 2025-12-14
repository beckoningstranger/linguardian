import ActivityRow from "@/components/Profile/ActivityRow";
import { LanguageWithFlagAndName } from "@linguardian/shared/contracts";

interface ActivityOverviewProps {
  language: LanguageWithFlagAndName;
}
export default function ActivityOverview({ language }: ActivityOverviewProps) {
  return (
    <div
      id={`LastWeekActivity-${language.name}`}
      className="flex flex-col gap-4 px-4 py-2 tablet:px-12"
    >
      <p className="font-serif text-hlg">Last Week&apos;s Activity</p>
      <div className="flex flex-col gap-1 phone:gap-2">
        <ActivityRow mode="Planted" amount={12} />
        <ActivityRow mode="Reviewed" amount={25} />
        <ActivityRow mode="Mnemonics" amount={7} />
      </div>
    </div>
  );
}
