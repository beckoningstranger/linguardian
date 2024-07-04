import { normalizeString, slugifyString } from "../lib/helperFunctions.js";
import {
  ItemWithPopulatedTranslations,
  SupportedLanguage,
} from "../lib/types.js";
import Items from "./item.schema.js";

export async function getOneItemById(id: string) {
  return await Items.findOne({ _id: id });
}

export async function getFullyPopulatedItemBySlug(
  queryItemLanguage: SupportedLanguage,
  slug: string,
  userLanguages: SupportedLanguage[]
) {
  const paths: any = [];
  userLanguages.forEach((lang) =>
    paths.push({
      path: "translations." + lang,
      select: `name language slug`,
    })
  );
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
  const normalizedLowerCaseQuery = normalizeString(query);
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

export async function editBySlug(
  slug: string,
  item: ItemWithPopulatedTranslations
) {
  return await Items.findOneAndUpdate(
    { slug: slug },
    {
      ...item,
      slug: slugifyString(item.name, item.language),
      normalizedName: normalizeString(item.name),
      gender: item.partOfSpeech === "noun" ? item.gender : undefined,
      case: item.partOfSpeech === "preposition" ? item.case : undefined,
      pluralForm:
        item.partOfSpeech === "noun" || item.partOfSpeech === "adjective"
          ? item.pluralForm
          : undefined,
    },
    {
      new: true,
    }
  );
}
