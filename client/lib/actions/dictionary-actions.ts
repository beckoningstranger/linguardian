"use server";

import { executeAction } from "@/lib/utils";
import { Item, SupportedLanguage } from "@/lib/contracts";
import { searchDictionary } from "@/lib/api/dictionary-api";

export async function searchDictionaryAction(
  languages: SupportedLanguage[],
  query: string
): Promise<Item[]> {
  return await executeAction({
    apiCall: () => searchDictionary(languages, query),
  });
}
