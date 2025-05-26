import Flag from "react-world-flags";

import { ItemWithPopulatedTranslations } from "@/lib/types";
import ItemPartOfSpeech from "./ItemPartOfSpeech";
import ItemSection from "./ItemSection";
import ItemTranslations from "./ItemTranslations";

interface ItemDetailsProps {
  item: ItemWithPopulatedTranslations;
}

export default async function ItemDetails({ item }: ItemDetailsProps) {
  const {
    name,
    tags,
    gender,
    partOfSpeech,
    IPA,
    pluralForm,
    flagCode,
    case: itemCase,
    translations,
  } = item;

  return (
    <div className="flex min-h-[calc(100vh-112px)] w-full flex-col gap-y-2 bg-white/80 px-4 tablet:p-2">
      <div id="flagAndName" className="flex items-center gap-x-2">
        <Flag code={flagCode} className="size-14 rounded-full object-cover" />
        <h1 id="itemName" className="font-serif text-hlg">
          {name}
        </h1>
      </div>
      <div className="px-2">
        {/* <ItemTags tags={tags} /> */}
        {IPA && IPA.length > 0 && (
          <div className="font-IPA text-cxlb text-grey-800">
            /{IPA.join(", ")}/
          </div>
        )}
        <ItemPartOfSpeech gender={gender} partOfSpeech={partOfSpeech} />
        {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
          <div className="text-cxlb">
            {pluralForm.length > 1 ? "plural forms: " : "plural form: "}
            {pluralForm.join(", ")}
          </div>
        )}
        {itemCase && <div className="text-cxlb">followed by {itemCase}</div>}
      </div>
      <ItemSection title="Definition">{item.definition}</ItemSection>
      <ItemSection title="Translations">
        <ItemTranslations translations={translations} />
      </ItemSection>
      {/* <ItemSection title="Used in context">asdf</ItemSection> */}
    </div>
  );
}
