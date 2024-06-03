import { SupportedLanguage } from "../types.js";
import Items from "./item.schema.js";

export async function getOneItemById(id: string) {
  return await Items.findOne({ _id: id });
}

export async function getOneItemBySlug(
  language: SupportedLanguage,
  slug: string
) {
  return await Items.findOne({ language: language, slug: slug });
}

export async function getAllSlugsForLanguage(language: SupportedLanguage) {
  return await Items.find(
    { language: language },
    { slug: 1, language: 1, _id: 0 }
  );
}

export async function findItemsByName(
  language: SupportedLanguage,
  query: string
) {
  return await Items.find(
    { name: { $regex: query }, language: language },
    { slug: 1, name: 1, _id: 0, partOfSpeech: 1, IPA: 1 }
  );
}
