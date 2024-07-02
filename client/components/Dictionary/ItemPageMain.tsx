import { Case, Gender, PartOfSpeech } from "@/lib/types";

interface ItemPageMainProps {
  itemName: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender;
  case?: Case;
  IPA?: string[];
  pluralForm?: string[];
}

export default function ItemPageMain({
  itemName,
  partOfSpeech,
  gender,
  IPA,
  pluralForm,
}: ItemPageMainProps) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">{itemName}</h1>
        <div>
          {gender && <span>{gender}</span>}
          <span> {partOfSpeech}</span>
        </div>
      </div>
      {IPA && IPA.length > 0 && (
        <div className="ml-2">/ {IPA.join(", ")} /</div>
      )}
      {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
        <div className="ml-2 mt-1 text-sm">plural: {pluralForm}</div>
      )}
    </div>
  );
}
