import { Metadata } from "next";
import { notFound } from "next/navigation";

import CreateNewListForm from "@/components/Forms/createNewListForm";
import { SupportedLanguage } from "@/lib/contracts";
import { allLanguageFeatures } from "@/lib/siteSettings";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Upload a new list",
};

interface CreateListProps {
  params: Promise<{ language: SupportedLanguage }>;
}

export default async function CreateList(props: CreateListProps) {
  const params = await props.params;

  const {
    language
  } = params;

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
