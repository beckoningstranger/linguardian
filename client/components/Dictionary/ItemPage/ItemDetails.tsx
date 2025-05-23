import { ItemWithPopulatedTranslations } from "@/lib/types";
import Flag from "react-world-flags";
import ItemPartOfSpeech from "./ItemPartOfSpeech";

interface ItemDetailsProps {
  item: ItemWithPopulatedTranslations;
}

export default function ItemDetails({ item }: ItemDetailsProps) {
  const { name, tags, gender, partOfSpeech, IPA, pluralForm, flagCode } = item;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <Flag code={flagCode} className="size-14 rounded-full object-cover" />
        <h1 id="itemName" className="font-serif text-hlg">
          {name}
        </h1>
      </div>
      <div className="ml-2">
        {/* <ItemTags tags={tags} /> */}
        {IPA && IPA.length > 0 && (
          <div className="ml-2 font-IPA text-slate-500">/{IPA.join(", ")}/</div>
        )}
        <ItemPartOfSpeech gender={gender} partOfSpeech={partOfSpeech} />
        {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
          <div className="ml-2 mt-1 text-sm">
            {pluralForm.length > 1 ? "plural forms: " : "plural form: "}
            {pluralForm.join(", ")}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4"></div>
    </div>
  );
}
