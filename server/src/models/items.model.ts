import { SupportedLanguage } from "../types.js";
import Items from "./item.schema.js";

export async function getOneItemById(id: string) {
  return await Items.findOne({ _id: id });
}

export async function getFullyPopulatedItemBySlug(
  language: SupportedLanguage,
  slug: string,
  userNative: SupportedLanguage
) {
  return await Items.findOne({ language: language, slug: slug })
    .populate("translations." + userNative)
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
  return await Items.find(
    { name: { $regex: query }, language: { $in: languages } },
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
