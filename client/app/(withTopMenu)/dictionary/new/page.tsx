import EditOrCreateItem from "@/components/Dictionary/EditOrCreateItem";
import { getAllLanguageFeatures } from "@/lib/fetchData";
import { getSeperatedUserLanguagesWithFlags } from "@/lib/helperFunctionsServer";

export default async function NewItemPage() {
  const [seperatedUserLanguagesWithFlags, allLanguageFeatures] =
    await Promise.all([
      getSeperatedUserLanguagesWithFlags(),
      getAllLanguageFeatures(),
    ]);

  return (
    <EditOrCreateItem
      allLanguageFeatures={allLanguageFeatures!}
      userLanguagesWithFlags={seperatedUserLanguagesWithFlags}
    />
  );
}
