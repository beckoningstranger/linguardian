import CreateNewListForm from "@/components/createNewListForm";
import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload a new list",
};

interface CreateListProps {
  params: { language: SupportedLanguage };
}

export default async function CreateList({
  params: { language },
}: CreateListProps) {
  const sessionUser = await getUserOnServer();
  const languageFeaturesForLanguage = await getLanguageFeaturesForLanguage(
    language
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="max-w-88 m-4 text-center text-2xl font-bold">
        Create a new {languageFeaturesForLanguage?.langName} list
      </h1>
      <CreateNewListForm userId={sessionUser.id} listLanguage={language} />
    </div>
  );
}
