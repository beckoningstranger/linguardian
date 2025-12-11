import { Gender, PartOfSpeech } from "@/lib/contracts";

interface ItemPartOfSpeechProps {
  gender?: Gender;
  partOfSpeech: PartOfSpeech;
}

export default function ItemPartOfSpeech({
  gender,
  partOfSpeech,
}: ItemPartOfSpeechProps) {
  return (
    <div className="flex gap-x-1 text-clgm">
      {gender && <span>{gender}</span>}
      <span>{partOfSpeech}</span>
    </div>
  );
}
