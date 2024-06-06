import { addNewLanguageToLearn, getUserById } from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";
import paths from "@/paths";
import { SupportedLanguage } from "@/types";
import { redirect } from "next/navigation";

interface AddListToDashboardProps {
  searchParams: { lang: SupportedLanguage; list: number };
}

export default async function AddNewLanguageToLearn({
  searchParams,
}: AddListToDashboardProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (searchParams && searchParams.lang && user && user.id) {
    const { lang } = searchParams;
    await addNewLanguageToLearn(user.id, lang);

    redirect(paths.listsLanguagePath(lang));
  } else {
    return "Page must be called with correct searchParams";
  }
}
