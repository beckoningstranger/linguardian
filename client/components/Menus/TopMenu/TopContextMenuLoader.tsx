import notFound from "@/app/not-found";
import { getPopulatedList } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import TopContextMenu from "./TopContextMenu";

interface TopContextMenuLoaderProps {
  listNumber?: number;
  itemSlug?: string;
  editMode?: boolean;
  comingFrom?: string;
}
export default async function TopContextMenuLoader({
  listNumber,
  itemSlug,
  editMode,
  comingFrom,
}: TopContextMenuLoaderProps) {
  if (itemSlug) {
    return <TopContextMenu comingFrom={comingFrom} itemSlug={itemSlug} />;
  }

  if (listNumber) {
    const [user, listData] = await Promise.all([
      await getUserOnServer(),
      getPopulatedList(listNumber),
    ]);

    if (!listData || !user) return notFound();
    const userIsAuthor = listData?.authors.includes(user.id) || false;

    const userIsLearningList =
      user.learnedLists[listData.language.code]?.includes(listNumber);

    return (
      <TopContextMenu
        userIsAuthor={userIsAuthor}
        userIsLearningList={userIsLearningList || false}
        editMode={editMode}
      />
    );
  }
}
