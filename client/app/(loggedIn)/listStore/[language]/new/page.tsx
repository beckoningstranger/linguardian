import { Metadata } from "next";
import { notFound } from "next/navigation";

import CreateNewListForm from "@/components/Forms/createNewListForm";
import { SupportedLanguage } from "@/lib/contracts";
import { allLanguageFeatures } from "@/lib/siteSettings";
import { Button } from "@/components/index";

export const metadata: Metadata = {
  title: "Upload a new list",
};

interface CreateListProps {
  params: { language: SupportedLanguage };
}

export default async function CreateList({
  params: { language },
}: CreateListProps) {
  const languageFeaturesForLanguage = allLanguageFeatures.find(
    (lang) => lang.langCode === language
  );

  if (!languageFeaturesForLanguage) return notFound();

  return (
    <div className="flex w-full grow tablet:w-auto tablet:justify-center tablet:pt-4">
      <CreateNewListForm
        language={{
          code: languageFeaturesForLanguage.langCode,
          flag: languageFeaturesForLanguage.flagCode,
          name: languageFeaturesForLanguage.langName,
        }}
      />
    </div>
  );
}
