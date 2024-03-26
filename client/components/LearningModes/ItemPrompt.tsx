import { ItemPopulatedWithTranslations, SupportedLanguage } from "@/types";

interface ItemPromptProps {
  item: ItemPopulatedWithTranslations;
  userNative: SupportedLanguage;
}

export default function ItemPrompt({ item, userNative }: ItemPromptProps) {
  const promptString = item.translations[userNative]
    .reduce((a, curr) => {
      a.push(curr.name);
      return a;
    }, [] as string[])
    .join(", ");

  return (
    <div className={`w-95 rounded-md bg-slate-200 py-2 text-center`}>
      <h3 className="my-3 text-2xl">{promptString}</h3>
      <p className="text-sm">{item.partOfSpeech}</p>
    </div>
  );
}
