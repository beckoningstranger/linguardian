import { Case, Gender, PartOfSpeech, Tag } from "@/lib/types";
import Flag from "react-world-flags";

interface ItemPageMainProps {
  itemName: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender;
  case?: Case;
  IPA?: string[];
  pluralForm?: string[];
  tags?: Tag[];
}

export default function ItemPageMain({
  itemName,
  partOfSpeech,
  gender,
  IPA,
  pluralForm,
  tags,
}: ItemPageMainProps) {
  return (
    <>
      <div className="flex">
        <Flag code="DE" className="size-14 rounded-full object-cover" />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{itemName}</h1>
            {tags?.map((tag) => (
              <span
                key={tag}
                className="ml-2 rounded-md border border-slate-400 bg-slate-100 px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="ml-2">
            {gender && <span>{gender}</span>}
            <span> {partOfSpeech}</span>
          </div>
        </div>
        {IPA && IPA.length > 0 && (
          <div className="font-voces ml-2 text-slate-500">
            /{IPA.join(", ")}/
          </div>
        )}
        {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
          <div className="ml-2 mt-1 text-sm">
            {pluralForm.length > 1 ? "plural forms: " : "plural form: "}
            {pluralForm.join(", ")}
          </div>
        )}
      </div>
    </>
  );
}
