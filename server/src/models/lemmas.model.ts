import { SupportedLanguage } from "../types.js";
import Lemmas from "./lemma.schema.js";

export async function getAllItemsForLemma(
  lemma: string,
  language: SupportedLanguage
) {
  try {
    const response = await Lemmas.findOne(
      { name: lemma, language: language },
      { items: 1 }
    ).populate({ path: "items" });
    if (response) return response.items;
    throw new Error("No items found for this lemma");
  } catch (err) {
    console.error(`Error getting all items for lemma ${lemma}: ${err}`);
  }
}

export async function getAllLemmas(language: SupportedLanguage) {
  try {
    const response = await Lemmas.find({ language: language });
    if (response.length > 0) return response;
    throw new Error(`No Lemmas found or language '${language}' not supported`);
  } catch (err) {
    console.error(`Error getting all lemmas: ${err}`);
  }
}
