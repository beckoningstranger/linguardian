import { Types } from "mongoose";
import {
  normalizeString,
  slugifyString,
  toObjectId,
} from "../lib/helperFunctions.js";
import { siteSettings } from "../lib/siteSettings.js";
import {
  Item,
  ItemWithPopulatedTranslations,
  PartOfSpeech,
  SupportedLanguage,
  Tag,
} from "../lib/types.js";
import Items from "./item.schema";
import { itemSchemaWithPopulatedTranslations } from "../lib/validations.js";

export async function getItemBySlug(slug: string) {
  return await Items.findOne({ slug });
}

export async function getItemById(_id: Types.ObjectId) {
  return await Items.findOne({ _id });
}

export async function getPopulatedItemBySlug(
  slug: string,
  userLanguages: readonly SupportedLanguage[]
): Promise<ItemWithPopulatedTranslations | null> {
  const paths = userLanguages.map((lang) => ({
    path: "translations." + lang,
  }));

  const retrievedItem = await Items.findOne({ slug }).populate(paths).lean();
  if (!retrievedItem) return null;
  return itemSchemaWithPopulatedTranslations.parse(retrievedItem);
}

export async function getAllSlugsForLanguage(language: SupportedLanguage) {
  return await Items.find({ language: language }).select("slug language -_id");
}

export async function findItemsByName(
  languages: SupportedLanguage[],
  query: string
) {
  const normalizedLowerCaseQuery = normalizeString(query);
  return await Items.find({
    normalizedName: { $regex: normalizedLowerCaseQuery },
    language: { $in: languages },
  });
}

export async function editOrCreateBySlug(
  item: Omit<ItemWithPopulatedTranslations, "_id">,
  slug: string
) {
  const isNewItem = item.slug === "new-item" ? true : false;

  const update: Omit<ItemWithPopulatedTranslations, "_id"> = {
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
    definition: item.definition || undefined,
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

function resolveConflictsInUpdate(
  update: Omit<ItemWithPopulatedTranslations, "_id">
) {
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
    (key) =>
      update[key as keyof Omit<ItemWithPopulatedTranslations, "_id">] ===
      undefined
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
  const languageFeatures = siteSettings.languageFeatures.find(
    (lang) => lang.langCode === language
  );
  const validTags = languageFeatures?.tags.forAll
    .concat(languageFeatures.tags[partOfSpeech])
    .filter((item) => item !== undefined);

  if (validTags)
    return tagArray.filter((tag) => validTags.includes(tag as Tag)) as Tag[];
  return [] as Tag[];
}

export async function removeTranslationBySlug(
  translationToRemove_id: string,
  slug: string
) {
  const translationsObjectId = toObjectId(translationToRemove_id);
  const language = (await Items.findOne({ _id: translationsObjectId }))
    ?.language;
  return await Items.updateOne(
    { slug },
    { $pull: { [`translations.${language}`]: translationsObjectId } }
  );
}

export async function addTranslationBySlug(
  translationToAdd_id: string,
  slug: string
) {
  const language = (await Items.findOne({ slug }))?.language;
  return await Items.updateOne(
    { slug },
    {
      $addToSet: {
        [`translations.${language}`]: toObjectId(translationToAdd_id),
      },
    }
  );
}
