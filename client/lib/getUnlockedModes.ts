import { getNativeLanguage, getPopulatedList } from "@/app/actions";
import getUserOnServer from "./getUserOnServer";

export default async function getUnlockedModes(listNumber: number) {
  const listData = await getPopulatedList(listNumber);
  if (!listData || !listData.unlockedReviewModes)
    throw new Error("Could not get listData");

  const sessionUser = await getUserOnServer();
  const usersNativeLanguage = await getNativeLanguage(sessionUser.id);
  if (!usersNativeLanguage)
    throw new Error("Error getting users native language");
  const unlockedReviewModes =
    listData?.unlockedReviewModes[usersNativeLanguage];
  return unlockedReviewModes;
}
