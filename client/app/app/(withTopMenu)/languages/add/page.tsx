import { addNewLanguageToLearn, getUserById } from "@/app/actions";
import { SupportedLanguage } from "@/types";
import { redirect } from "next/navigation";

interface AddListToDashboardProps {
  searchParams: { lang: SupportedLanguage; list: number };
}

export default async function AddNewLanguageToLearn({
  searchParams,
}: AddListToDashboardProps) {
  const user = await getUserById(1);

  if (searchParams && searchParams.lang && user && user.id) {
    const { lang } = searchParams;
    await addNewLanguageToLearn(user.id, lang);

    redirect(`/app/lists?lang=${lang}`);
  } else {
    return "Page must be called with correct searchParams";
  }
}
