import IconSidebar from "@/components/IconSidebar/IconSidebar";
import LearningButton from "@/components/ui/LearningButton";

export default function ListOverviewLearningButtons() {
  return (
    <IconSidebar showOn="desktop">
      <div className="relative w-[90px]">
        <div className="absolute right-0 flex flex-col items-end gap-2">
          <LearningButton
            mode="learn"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
          <LearningButton
            mode="translation"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
          <LearningButton
            mode="context"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
          <LearningButton
            mode="dictionary"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
          <LearningButton
            mode="spellingBee"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
          <LearningButton
            mode="visual"
            showIcon
            rounded
            listNumber={1}
            itemNumber={23}
          />
        </div>
      </div>
    </IconSidebar>
  );
}
