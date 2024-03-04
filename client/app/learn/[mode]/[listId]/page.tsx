import { Item } from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";

// Fetch items here
const items: Item[] = [];

interface ReviewPageProps {
  params: {
    mode: string;
    listId: string;
  };
}

export default function ReviewPage({
  params: { mode, listId },
}: ReviewPageProps) {
  const courseId = parseInt(listId);

  // This is where we look up the list's name based on the passed listId
  const listName = "Example list";

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  switch (mode) {
    case "translation":
      return "Go to TranslationMode "; //<TranslationMode items={items} listName={listName} />;
    case "learn":
      return <LearnNewWordsMode items={items} listName={listName} />;
    default:
      throw new Error("Unknown Learning Mode");
  }
}
