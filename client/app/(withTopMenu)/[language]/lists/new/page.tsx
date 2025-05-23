import { Metadata } from "next";

import CreateNewListForm from "@/components/createNewListForm";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import { siteSettings } from "@/lib/siteSettings";
import { SupportedLanguage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Upload a new list",
};

interface CreateListProps {
  params: { language: SupportedLanguage };
}

export default async function CreateList({
  params: { language },
}: CreateListProps) {
  const user = await getUserOnServer();
  const languageFeaturesForLanguage = siteSettings.languageFeatures.find(
    (lang) => lang.langCode === language
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="max-w-88 m-4 text-center text-2xl font-bold">
        Create a new {languageFeaturesForLanguage?.langName} list
      </h1>
      <CreateNewListForm userId={user.id} languageCode={language} />
    </div>
  );
}
