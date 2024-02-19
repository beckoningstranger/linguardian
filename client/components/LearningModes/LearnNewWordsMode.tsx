import { Item } from "@/app/context/GlobalContext";

interface LearnNewWordsModeProps {
  items: Item[];
  listName?: string;
}

export default function LearnNewWordsMode({}: LearnNewWordsModeProps) {
  return <div>Learn New Words Mode</div>;
}
