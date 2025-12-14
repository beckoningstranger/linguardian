import {
  ListForListStore,
  ListStoreData,
  ListStoreDataParams,
} from "@linguardian/shared/contracts";
import { findAllListsForLanguage } from "@/repositories/list.repo";
import { findAuthors } from "@/repositories/user.repo";

export async function ListStoreDataService({
  language,
}: ListStoreDataParams): Promise<ListStoreData> {
  const allListsForLanguageResponse = await findAllListsForLanguage(language);
  if (!allListsForLanguageResponse.success)
    throw new Error(
      `Could not get lists for language ${language}: ${allListsForLanguageResponse.error}`
    );

  const findAllListsForLanguageDataPromises =
    allListsForLanguageResponse.data.map(async (list) => {
      const authorDataResponse = await findAuthors(list.authors);

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
    findAllListsForLanguageDataPromises
  );

  return { allListsForLanguage };
}
