import Flag from "react-world-flags";

import { ItemWithPopulatedTranslations } from "@/lib/types";
import ItemPartOfSpeech from "./ItemPartOfSpeech";
import ItemSection from "./ItemSection";
import ItemTranslations from "./ItemTranslations";
import ItemContext from "./ItemContext";
import ItemPluralForms from "./ItemPluralForms";
import ItemIPA from "./ItemIPA";

interface ItemDetailsProps {
  item: ItemWithPopulatedTranslations;
}

export default async function ItemDetails({ item }: ItemDetailsProps) {
  const {
    name,
    tags,
    context,
    gender,
    definition,
    partOfSpeech,
    IPA,
    pluralForm,
    flagCode,
    case: itemCase,
    translations,
  } = item;

  return (
    <div className="flex min-h-[calc(100vh-112px)] w-full flex-col gap-y-2 bg-white/90 px-2 pb-24 phone:pt-2 tablet:pt-8">
      <div id="flagAndName" className="flex items-center gap-x-2">
        <Flag code={flagCode} className="size-14 rounded-full object-cover" />
        <h1 id="itemName" className="font-serif text-hlg">
          {name}
        </h1>
      </div>
      <div className="px-2">
        {/* <ItemTags tags={tags} /> */}
        <ItemIPA IPA={IPA} />
        <ItemPartOfSpeech gender={gender} partOfSpeech={partOfSpeech} />
        {itemCase && <div className="text-cxlb">followed by {itemCase}</div>}
        <ItemPluralForms pluralForm={pluralForm} />
      </div>
      <div className="mt-4 flex flex-col gap-y-8">
        <ItemSection title="Definition">{definition}</ItemSection>
        <ItemTranslations translations={translations} />
        <ItemContext context={context} />
      </div>
    </div>
  );
}
