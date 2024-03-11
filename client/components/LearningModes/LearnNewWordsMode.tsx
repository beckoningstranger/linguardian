import { ItemPopulatedWithTranslations } from "@/types";

interface LearnNewWordsModeProps {
  items: ItemPopulatedWithTranslations[];
  listName?: string;
}

export default function LearnNewWordsMode({}: LearnNewWordsModeProps) {
  return <div>Learn New Words Mode</div>;
}
