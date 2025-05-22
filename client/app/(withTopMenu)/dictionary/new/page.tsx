import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getAllLanguageFeatures } from "@/lib/fetchData";
import { getSeperatedUserLanguages } from "@/lib/helperFunctionsServer";

export default async function NewItemPage() {
  const [seperatedUserLanguages, allLanguageFeatures] = await Promise.all([
    getSeperatedUserLanguages(),
    getAllLanguageFeatures(),
  ]);

  return (
    <EditOrCreateItem
      allLanguageFeatures={allLanguageFeatures!}
      seperatedUserLanguages={seperatedUserLanguages}
    />
  );
}
