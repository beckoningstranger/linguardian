import { Types } from "mongoose";
import { normalizeString, slugifyString } from "../lib/helperFunctions.js";
import {
  Item,
  ItemWithPopulatedTranslations,
  PartOfSpeech,
  SupportedLanguage,
  Tag,
} from "../lib/types.js";
import Items from "./item.schema.js";
import { getLanguageFeaturesForLanguage } from "./settings.model.js";

export async function getItemBySlug(slug: string) {
  return await Items.findOne({ slug });
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
  const item = (await Items.findOne({ language: queryItemLanguage, slug })
    .populate(paths)
    .exec()) as Omit<Item, "translations"> & {
    translations: {
      [key in SupportedLanguage]?: {
        _id: Types.ObjectId;
        name: string;
        language: string;
        slug: string;
      }[];
    };
  };
  return item;
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
      _id: 1,
      normalizedName: 1,
      name: 1,
      slug: 1,
      partOfSpeech: 1,
      IPA: 1,
      definition: 1,
      language: 1,
    }
  );
}

export async function editOrCreateBySlug(
  item: ItemWithPopulatedTranslations,
  slug: string
) {
  const isNewItem = item.slug === "new-item" ? true : false;

  const update: ItemWithPopulatedTranslations = {
    ...item,
    tags: await filterOutInvalidTags(
      item.tags,
      item.partOfSpeech,
      item.language
    ),
    slug: slugifyString(item.name, item.language),
    normalizedName: normalizeString(item.name),
    gender: item.partOfSpeech === "noun" ? item.gender : undefined,
    case: item.partOfSpeech === "preposition" ? item.case : undefined,
    pluralForm:
      item.partOfSpeech === "noun" || item.partOfSpeech === "adjective"
        ? item.pluralForm && item.pluralForm.length > 0
          ? item.pluralForm
          : undefined
        : undefined,
  };

  const conflictFreeUpdate: ItemWithPopulatedTranslations =
    resolveConflictsInUpdate(update);

  return await Items.findOneAndUpdate({ slug: slug }, conflictFreeUpdate, {
    new: true,
    upsert: isNewItem,
  });
}

function resolveConflictsInUpdate(update: ItemWithPopulatedTranslations) {
  // When doing the given update, MongoDB will save undefined values as null, which collides with zod validation
  // and causes problems. Below code fixes this by instead unsetting the keys that have undefined values.
  const conflictFreeUpdate: any = { $set: {}, $unset: {} };
  const propertiesToSet = Object.entries(update).filter(
    (entry) => entry[1] !== undefined
  );
  propertiesToSet.forEach(
    (entry) => (conflictFreeUpdate.$set[entry[0]] = entry[1])
  );

  const propertiesToUnset: any = {};
  const propertiesWithValueUndefined = Object.keys(update).filter(
    (key) => update[key as keyof ItemWithPopulatedTranslations] === undefined
  );
  propertiesWithValueUndefined.forEach(
    (property) => (propertiesToUnset[property] = 1)
  );
  conflictFreeUpdate.$unset = propertiesToUnset;
  return conflictFreeUpdate;
}

async function filterOutInvalidTags(
  tagArray: string[] | undefined,
  partOfSpeech: PartOfSpeech,
  language: SupportedLanguage
) {
  if (!tagArray) return [];
  const languageFeatures = await getLanguageFeaturesForLanguage(language);
  const validTags = languageFeatures?.tags.forAll
    .concat(languageFeatures.tags[partOfSpeech])
    .filter((item) => item !== undefined);

  if (validTags)
    return tagArray.filter((tag) => validTags.includes(tag as Tag)) as Tag[];
  return [] as Tag[];
}

export async function removeTranslationBySlug(
  translationToRemove: Types.ObjectId,
  slug: string
) {
  const language = (await Items.findOne({ _id: translationToRemove }))
    ?.language;
  return await Items.updateOne(
    { slug },
    { $pull: { [`translations.${language}`]: translationToRemove } }
  );
}

export async function addTranslationBySlug(
  translationToAdd: Types.ObjectId,
  slug: string
) {
  const language = (await Items.findOne({ slug }))?.language;
  return await Items.updateOne(
    { slug },
    { $addToSet: { [`translations.${language}`]: translationToAdd } }
  );
}
