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
    <IconSidebar position="right" showOn="desktop">
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
    </IconSidebar>
  );
}
