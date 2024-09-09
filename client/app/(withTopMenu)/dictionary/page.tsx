import Search from "@/components/Dictionary/Search";
import {
  getLanguageFeaturesForLanguage,
  getRecentDictionarySearches,
} from "@/lib/fetchData";
import { getAllUserLanguagesWithFlags } from "@/lib/helperFunctions";
import { LanguageFeatures } from "@/lib/types";

export const metadata = { title: "Dictionary" };

export default async function DictionaryPage() {
  const [userLanguagesWithFlags, recentSearches] = await Promise.all([
    getAllUserLanguagesWithFlags(),
    getRecentDictionarySearches(),
  ]);

  const languageFeaturesForUserLanguagesPromises = userLanguagesWithFlags
    .map((lwf) => lwf.name)
    .map((lang) => getLanguageFeaturesForLanguage(lang));

  const languageFeaturesForUserLanguages = (
    await Promise.all(languageFeaturesForUserLanguagesPromises)
  ).filter((features): features is LanguageFeatures => features !== undefined);

  return (
    <div className="md:mx-12">
      <Search
        searchLanguagesWithFlags={userLanguagesWithFlags}
        mode="searchResultIsLinkToItemPage"
        recentSearches={recentSearches}
      />
    </div>
  );
}
