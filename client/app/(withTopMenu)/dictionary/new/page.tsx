import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import { getSeperatedUserLanguages } from "@/lib/helperFunctionsServer";

export default async function NewItemPage() {
  const [seperatedUserLanguages] = await Promise.all([
    getSeperatedUserLanguages(),
  ]);

  return <EditOrCreateItem seperatedUserLanguages={seperatedUserLanguages} />;
}
