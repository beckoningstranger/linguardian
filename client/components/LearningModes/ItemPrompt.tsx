import {
  ItemWithPopulatedTranslationsFE,
  SupportedLanguage,
} from "@/lib/types";

interface ItemPromptProps {
  item: ItemWithPopulatedTranslationsFE;
  userNative: SupportedLanguage;
}

export default function ItemPrompt({ item, userNative }: ItemPromptProps) {
  const promptString = item.translations[userNative]
    ?.map((item) => item.name)
    .join(", ");

  return (
    <div
      className="mt-1 grid justify-center gap-1 bg-white/95 py-4 text-center shadow-lg desktop:py-8"
      id="ItemPrompt"
    >
      <h3 className="font-serif text-hmd tablet:text-hlg">{promptString}</h3>
      <p className="text-cmdr tablet:text-clgr">{item.partOfSpeech}</p>
    </div>
  );
}
