import { SupportedLanguage } from "../types.js";
import Items from "./item.schema.js";

export async function getOneItemById(id: string) {
  return await Items.findOne({ _id: id });
}

export async function getFullyPopulatedItemBySlug(
  queryItemLanguage: SupportedLanguage,
  slug: string,
  userLanguages: SupportedLanguage[]
) {
  const paths: string[] = [];
  userLanguages.forEach((lang) => paths.push("translations." + lang));
  return await Items.findOne({ language: queryItemLanguage, slug: slug })
    .populate(paths)
    .exec();
}

export async function getAllSlugsForLanguage(language: SupportedLanguage) {
  return await Items.find(
    { language: language },
    { slug: 1, language: 1, _id: 0 }
  );
}

export async function findItemsByName(
  languages: SupportedLanguage[],
  query: string
) {
  const normalizedLowerCaseQuery = query
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return await Items.find(
    {
      normalizedName: { $regex: normalizedLowerCaseQuery },
      language: { $in: languages },
    },
    {
      slug: 1,
      name: 1,
      _id: 0,
      partOfSpeech: 1,
      IPA: 1,
      definition: 1,
      language: 1,
    }
  );
}
