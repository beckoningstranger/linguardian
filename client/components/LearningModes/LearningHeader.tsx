import { QuitLearningSessionButton } from "@/components";
import { LearningMode, SupportedLanguage } from "@/lib/contracts";

interface LearningHeaderProps {
  listName: string;
  listLanguage: SupportedLanguage;
  itemsInProgress: number;
  totalItems: number;
  mode: LearningMode;
  from: "dashboard" | number;
}

export default function LearningHeader({
  listName,
  listLanguage,
  itemsInProgress,
  totalItems,
  mode,
  from,
}: LearningHeaderProps) {
  const listNameElement = (
    <p className="font-serif text-hmd tablet:text-hlg">{listName}</p>
  );

  let modeName = "";
  switch (mode) {
    case "translation":
      modeName = "Translation Mode";
      break;
    case "context":
      modeName = "Context Mode";
      break;
    case "dictionary":
      modeName = "Definition Mode";
      break;
    case "spelling":
      modeName = "Spelling Bee Mode";
      break;
    case "visual":
      modeName = "Visual Mode";
      break;
  }

  return (
    <div
      id="LearningHeader"
      className="relative flex h-[112px] w-full items-center justify-between bg-white/95"
    >
      <QuitLearningSessionButton listLanguage={listLanguage} from={from} />
      <div
        id="LearningHeaderTitle"
        className="grid w-full gap-1 text-center text-cmdr"
      >
        {mode === "learn" ? (
          <div>
            <p>Learning new items in</p>
            {listNameElement}
          </div>
        ) : (
          <div>
            {listNameElement}
            <p>Reviewing items in {modeName}</p>
          </div>
        )}
        <p className="mt-2">
          {itemsInProgress} / {totalItems} items
        </p>
      </div>
    </div>
  );
}
