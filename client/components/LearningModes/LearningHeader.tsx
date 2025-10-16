import { QuitLearningSessionButton } from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
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

  return (
    <div
      id="LearningHeader"
      className="relative flex h-[112px] w-full items-center justify-between bg-white/95"
    >
      <MobileMenuContextProvider>
        <QuitLearningSessionButton listLanguage={listLanguage} from={from} />
      </MobileMenuContextProvider>
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
            <p>Reviewing items in {mode}</p>
          </div>
        )}
        <p className="mt-2">
          {itemsInProgress} / {totalItems} items
        </p>
      </div>
    </div>
  );
}
