import { getPopulatedList } from "@/lib/fetchData";
import getUserOnServer from "./getUserOnServer";
import { SupportedLanguage } from "@/types";

export default async function getUnlockedModes(listNumber: number) {
  const listData = await getPopulatedList(listNumber);
  if (!listData || !listData.unlockedReviewModes)
    throw new Error("Could not get listData");

  const sessionUser = await getUserOnServer();
  const usersNativeLanguage: SupportedLanguage = sessionUser.native.name;
  if (!usersNativeLanguage)
    throw new Error("Error getting users native language");
  const unlockedReviewModes =
    listData?.unlockedReviewModes[usersNativeLanguage];
  return unlockedReviewModes;
}
