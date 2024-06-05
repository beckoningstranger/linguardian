import { Case, Gender, PartOfSpeech } from "@/types";
import ItemPageContainer from "./ItemPageContainer";

interface ItemPageMainProps {
  itemName: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender;
  case?: Case;
  ipa?: string[];
  pluralForm?: string;
}

export default function ItemPageMain({
  itemName,
  partOfSpeech,
  gender,
  ipa,
  pluralForm,
}: ItemPageMainProps) {
  return (
    <ItemPageContainer>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">{itemName}</h1>
        <span>{partOfSpeech}</span>
      </div>
    </ItemPageContainer>
  );
}
