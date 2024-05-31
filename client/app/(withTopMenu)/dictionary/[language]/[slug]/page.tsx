import {
  checkPassedLanguageAsync,
  getAllSlugsForLanguage,
  getSupportedLanguages,
  lookUpItem,
} from "@/app/actions";
import { Item, SupportedLanguage } from "@/types";

interface SlugLanguageObject {
  language: string;
  slug: string;
}

export async function generateStaticParams() {
  const supportedLanguages = await getSupportedLanguages();
  let allSlugs: SlugLanguageObject[] = [];
  const promises = supportedLanguages?.map(async (lang: SupportedLanguage) =>
    getAllSlugsForLanguage(lang)
  );

  if (promises) {
    const resolvedPromises = await Promise.all(promises);
    if (resolvedPromises)
      resolvedPromises.forEach((language) =>
        language?.forEach((item) => {
          allSlugs.push(item);
        })
      );

    return allSlugs;
  } else {
    return [];
  }
}

interface ItemPageProps {
  params: { language: string; slug: string };
}

export default async function ItemPage({
  params: { slug, language },
}: ItemPageProps) {
  const passedLanguage = language?.toUpperCase();
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  if (!validPassedLanguage)
    return <div>There is no dictionary for this language</div>;

  const item: Item = await lookUpItem(language as SupportedLanguage, slug);
  if (!item) return <div>No item found</div>;

  return (
    <div>
      ItemPage for {item.name}, {item.partOfSpeech}
    </div>
  );
}
