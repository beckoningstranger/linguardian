import IconSidebar from "@/components/IconSidebar/IconSidebar";
import LearningButton from "@/components/ui/LearningButton";

interface ListOverviewLearningButtonsProps {
  listNumber: number;
  unitNumber?: number;
}
export default function ListOverviewLearningButtons({
  listNumber,
  unitNumber,
}: ListOverviewLearningButtonsProps) {
  return (
    <IconSidebar showOn="desktop">
      <div className="relative w-[90px]">
        <div className="absolute right-0 flex flex-col items-end gap-2">
          <LearningButton
            mode="learn"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
          <LearningButton
            mode="translation"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
          <LearningButton
            mode="context"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
          <LearningButton
            mode="dictionary"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
          <LearningButton
            mode="spellingBee"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
          <LearningButton
            mode="visual"
            showIcon
            rounded
            listNumber={listNumber}
            itemNumber={23}
            unitNumber={unitNumber}
          />
        </div>
      </div>
    </IconSidebar>
  );
}
