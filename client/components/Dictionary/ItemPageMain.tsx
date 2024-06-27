import { Case, Gender, PartOfSpeech } from "@/types";
import ItemPageContainer from "./ItemPageContainer";

interface ItemPageMainProps {
  itemName: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender[];
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
  console.log(IPA);
  return (
    <ItemPageContainer>
      <div className="">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{itemName}</h1>
          <div>
            {gender && <span>{gender.join("/")}</span>}
            <span> {partOfSpeech}</span>
          </div>
        </div>
        {IPA && IPA.length > 0 && (
          <div className="ml-2">/ {IPA.join(", ")} /</div>
        )}
        {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
          <div>Plural: {pluralForm}</div>
        )}
      </div>
    </ItemPageContainer>
  );
}
