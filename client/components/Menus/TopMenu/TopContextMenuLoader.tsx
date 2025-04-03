import notFound from "@/app/not-found";
import { getPopulatedList } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import TopContextMenu from "./TopContextMenu";
import { PopulatedList, User } from "@/lib/types";

interface TopContextMenuLoaderProps {
  listNumber?: number;
  opacity?: 50 | 80 | 90;
}
export default async function TopContextMenuLoader({
  listNumber,
  opacity,
}: TopContextMenuLoaderProps) {
  let listData: PopulatedList | undefined;
  let user: User;
  let userIsAuthor: boolean;

  if (listNumber) {
    [listData, user] = await Promise.all([
      getPopulatedList(listNumber),
      getUserOnServer(),
    ]);
    userIsAuthor = listData?.authors.includes(user.id) || false;
  }
  if (listNumber && !listData) return notFound();

  return <TopContextMenu opacity={opacity} listData={listData} userIsAuthor />;
}
