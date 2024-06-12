import { addNewLanguageToLearn } from "@/app/actions";
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

  if (searchParams && searchParams.lang) {
    const { lang } = searchParams;
    await addNewLanguageToLearn(sessionUser.id, lang);

    redirect(paths.listsLanguagePath(lang));
  } else {
    return "Page must be called with correct searchParams";
  }
}
