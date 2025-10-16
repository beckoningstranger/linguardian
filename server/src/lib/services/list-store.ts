import {
  ListForListStore,
  ListStoreData,
  ListStoreDataParams,
} from "@/lib/contracts";
import { getAllListsForLanguage } from "@/models/lists.model";
import { getAuthors } from "@/models/users.model";

export async function ListStoreDataService({
  language,
}: ListStoreDataParams): Promise<ListStoreData> {
  const allListsForLanguageResponse = await getAllListsForLanguage(language);
  if (!allListsForLanguageResponse.success)
    throw new Error(
      `Could not get lists for language ${language}: ${allListsForLanguageResponse.error}`
    );

  const getAllListsForLanguageDataPromises =
    allListsForLanguageResponse.data.map(async (list) => {
      const authorDataResponse = await getAuthors(list.authors);

      if (!authorDataResponse.success) {
        throw new Error(
          `Could not fetch author data: ${authorDataResponse.error}`
        );
      }

      const data: ListForListStore = {
        ...list,
        authorData: authorDataResponse.data,
      };
      return data;
    });

  const allListsForLanguage = await Promise.all(
    getAllListsForLanguageDataPromises
  );

  return { allListsForLanguage };
}
