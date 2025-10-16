import Search from "@/components/Dictionary/Search/Search";
import { fetchMultipleItemsById } from "@/lib/api/item-api";
import { Item } from "@/lib/contracts";

import { getUserOnServer } from "@/lib/utils/server";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const user = await getUserOnServer();
  if (!user)
    return <Search mode="searchResultIsLinkToItemPage" recentSearches={[]} />;

  const recentItemIds = user.recentDictionarySearches.map(
    (item) => item.itemId
  );
  const items = await fetchMultipleItemsById(recentItemIds);
  const itemsWithoutTranslations: Item[] = items.map((item) => ({
    ...item,
    translations: {},
  }));

  return (
    <Search
      mode="searchResultIsLinkToItemPage"
      recentSearches={itemsWithoutTranslations}
    />
  );
}
