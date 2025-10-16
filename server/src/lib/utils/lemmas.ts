import { Types } from "mongoose";

import { placeholders } from "@/lib/constants";
import { SupportedLanguage } from "@/lib/contracts";
import { Lemma, lemmaSchema, ParsedItem } from "@/lib/schemas";
import { safeDbWrite } from "@/lib/utils";
import Lemmas from "@/models/lemma.schema";

export async function getLemmasFromEachParsedItemAndUpload(
  item: ParsedItem
): Promise<string[]> {
  // Function to create lemmas from words that are not placeholders
  const createLemmas = (
    words: string[],
    language: SupportedLanguage
  ): Lemma[] =>
    words
      .filter((word) => word.length > 0 && !placeholders.includes(word))
      .map((word) => ({ name: word, language, items: [] }));

  // Extract lemmas from the item's name
  const lemmas: Lemma[] = [
    ...createLemmas(item.name.split(" "), item.language),
    ...Object.entries(item.translations || {}).flatMap(([lang, translations]) =>
      translations
        ? createLemmas(
            translations.map((translation) => translation.split(" ")).flat(),
            lang as SupportedLanguage
          )
        : []
    ),
  ];
  return await uploadLemmas(lemmas);
}

export async function uploadLemmas(lemmaArray: Lemma[]): Promise<string[]> {
  const lemmaUploadPromises = lemmaArray.map((lemmaItem) =>
    safeDbWrite({
      input: lemmaItem,
      dbWriteQuery: () =>
        Lemmas.findOneAndUpdate(
          { name: lemmaItem.name, language: lemmaItem.language },
          {
            $setOnInsert: lemmaItem,
          },
          { upsert: true }
        ),
      schemaForValidation: lemmaSchema,
      errorMessage: `Error uploading lemmas: ${lemmaItem.name}`,
    })
  );

  const responses = await Promise.all(lemmaUploadPromises);
  const issues: string[] = [];
  responses.forEach((response) => {
    if (!response.success) issues.push(response.error);
  });
  return issues;
}

export async function getAllLemmaObjectIdsForItem(
  item: string,
  itemLanguage: SupportedLanguage
): Promise<Types.ObjectId[]> {
  const lemmasForCurrentItem = item
    .split(" ")
    .filter((word) => !placeholders.includes(word));

  // Look up ObjectIds for found lemmas up in Mongodb
  const allFoundLemmaObjects = await Lemmas.find(
    { name: { $in: lemmasForCurrentItem }, language: itemLanguage },
    { _id: 1 }
  );
  const allFoundLemmaObjectIds = allFoundLemmaObjects.map(
    (lemmaObject) => lemmaObject._id
  );

  return allFoundLemmaObjectIds;
}
