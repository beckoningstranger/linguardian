import { SupportedLanguage } from "../types.js";
import Items from "./item.schema.js";

export async function getOneItem(item: string, language: SupportedLanguage) {
  try {
    const response = await Items.findOne({ name: item, language: language });
    if (response) return response;
    throw new Error("Item not found");
  } catch (err) {
    console.error(`Error getting item '${item}': ${err}`);
  }
}
