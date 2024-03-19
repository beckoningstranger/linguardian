import {
  addListToDashboard,
  addNewLanguageToLearn,
  getUserById,
} from "@/app/actions";
import { SupportedLanguage } from "@/types";
import { redirect } from "next/navigation";

interface AddListToDashboardProps {
  searchParams: { lang: SupportedLanguage; list: number; newLanguage?: string };
}

export default async function AddListToDashboard({
  searchParams,
}: AddListToDashboardProps) {
  const user = await getUserById(1);

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

    redirect(`/app/dashboard?lang=${lang}`);
  } else {
    return "Page must be called with correct searchParams";
  }
}
