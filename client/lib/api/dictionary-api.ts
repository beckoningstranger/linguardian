import { SERVER } from "@/lib/constants";

import {
  ApiResponse,
  Item,
  itemSchemaWithTranslations,
  SupportedLanguage,
} from "@/lib/contracts";
import { handleApiCall } from "@/lib/utils";
import { z } from "zod";

export async function searchDictionary(
  languages: SupportedLanguage[],
  query: string,
  signal?: AbortSignal
): Promise<ApiResponse<Item[]>> {
  const params = new URLSearchParams({
    languages: languages.join(","),
    query,
  });

  return await handleApiCall(
    () => fetch(`${SERVER}/items/search?${params.toString()}`, { signal }),
    z.array(itemSchemaWithTranslations)
  );
}
