import { Gender, PartOfSpeech, Tag } from "@/lib/types";

interface ItemPartOfSpeechProps {
  gender?: Gender;
  partOfSpeech: PartOfSpeech;
}

export default function ItemPartOfSpeech({
  gender,
  partOfSpeech,
}: ItemPartOfSpeechProps) {
  return (
    <div className="flex gap-x-1 text-cxlb">
      <span>{gender}</span>
      <span>{partOfSpeech}</span>
    </div>
  );
}
