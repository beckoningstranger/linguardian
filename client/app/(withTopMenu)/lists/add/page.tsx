import {
  addListToDashboard,
  addNewLanguageToLearn,
  getUserById,
} from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";
import { SupportedLanguage } from "@/types";
import { redirect } from "next/navigation";

interface AddListToDashboardProps {
  searchParams: { lang: SupportedLanguage; list: number; newLanguage?: string };
}

export default async function AddListToDashboard({
  searchParams,
}: AddListToDashboardProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (
    searchParams &&
    searchParams.lang &&
    searchParams.list &&
    user &&
    user?.id
  ) {
    const { lang, list } = searchParams;
    if (searchParams.newLanguage === "yes")
      await addNewLanguageToLearn(user.id, lang);
    await addListToDashboard(user.id, list);

    redirect(`/dashboard?lang=${lang}`);
  } else {
    return "Page must be called with correct searchParams";
  }
}
