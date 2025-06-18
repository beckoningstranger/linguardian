import Flag from "react-world-flags";

import { cn } from "@/lib/helperFunctionsClient";
import {
  ItemWithPopulatedTranslationsFE,
  LanguageWithFlagAndName,
} from "@/lib/types";
import ItemContext from "./ItemContext";
import ItemIPA from "./ItemIPA";
import ItemPartOfSpeech from "./ItemPartOfSpeech";
import ItemPluralForms from "./ItemPluralForms";
import ItemSection from "./ItemSection";
import ItemTranslations from "./ItemTranslations";

interface ItemDetailsProps {
  item: ItemWithPopulatedTranslationsFE;
  allUserLanguages: LanguageWithFlagAndName[];
  forItemPresentation?: boolean;
}

export default function ItemDetails({
  item,
  allUserLanguages,
  forItemPresentation = false,
}: ItemDetailsProps) {
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
    <div
      id="ItemDetails"
      className={cn(
        "flex w-full flex-col grow gap-y-2 bg-white/90 px-2 py-3",
        forItemPresentation && "desktop:px-8 tablet:py-4 tablet:px-6"
      )}
    >
      <div id="flagAndName" className="flex items-center gap-x-2">
        <Flag code={flagCode} className="size-14 rounded-full object-cover" />
        <h1 id="itemName" className="font-serif text-hlg">
          {name}
        </h1>
      </div>
      <div className="pl-2">
        {/* <ItemTags tags={tags} /> */}
        <ItemIPA IPA={IPA} />
        <ItemPartOfSpeech gender={gender} partOfSpeech={partOfSpeech} />
        {itemCase && <div className="text-clgm">followed by {itemCase}</div>}
        <ItemPluralForms pluralForm={pluralForm} />
      </div>
      <div className="mt-4 flex flex-col gap-y-8">
        <ItemSection title="Definition">{definition}</ItemSection>
        <ItemTranslations
          translations={translations}
          allUserLanguages={allUserLanguages}
          forItemPresentation
        />
        <ItemContext context={context} />
      </div>
    </div>
  );
}
