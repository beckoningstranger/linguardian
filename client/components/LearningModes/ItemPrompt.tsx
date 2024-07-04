import { ItemWithPopulatedTranslations, SupportedLanguage } from "@/lib/types";

interface ItemPromptProps {
  item: ItemWithPopulatedTranslations;
  userNative: SupportedLanguage;
}

export default function ItemPrompt({ item, userNative }: ItemPromptProps) {
  const promptString = item.translations[userNative]
    ?.map((item) => item.name)
    .join(", ");

  return (
    <div className={`w-95 rounded-md bg-slate-200 py-2 text-center`}>
      <h3 className="my-3 text-2xl">{promptString}</h3>
      <p className="text-sm">{item.partOfSpeech}</p>
    </div>
  );
}
