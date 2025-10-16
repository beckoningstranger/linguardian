import Flag from "react-world-flags";

import ItemContext from "@/components/Dictionary/ItemPage/ItemContext";
import ItemIPA from "@/components/Dictionary/ItemPage/ItemIPA";
import ItemPartOfSpeech from "@/components/Dictionary/ItemPage/ItemPartOfSpeech";
import ItemPluralForms from "@/components/Dictionary/ItemPage/ItemPluralForms";
import ItemSection from "@/components/Dictionary/ItemPage/ItemSection";
import ItemTranslations from "@/components/Dictionary/ItemPage/ItemTranslations";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "@/lib/contracts";
import { cn } from "@/lib/utils";

interface ItemDetailsProps {
  item: ItemWithPopulatedTranslations;
  allUserLanguageCodes: SupportedLanguage[];
  forItemPresentation?: boolean;
}

export default function ItemDetails({
  item,
  allUserLanguageCodes,
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
    grammaticalCase: itemCase,
    translations,
  } = item;

  return (
    <div
      id="ItemDetails"
      className={cn(
        "flex w-full flex-col grow gap-y-2 bg-white/90 px-2 py-3 tablet:px-4 desktop:px-8",
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
          allUserLanguageCodes={allUserLanguageCodes}
          forItemPresentation
        />
        <ItemContext context={context} />
      </div>
    </div>
  );
}
