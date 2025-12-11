import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPlus } from "react-icons/fa";

import Button from "@/components/ui/Button";
import ListSearch from "@/components/Lists/ListStore/ListSearch";
import ListStoreCard from "@/components/Lists/ListStore/ListStoreCard";
import { fetchListStoreDataForLanguage } from "@/lib/api/bff-api";
import { SupportedLanguage } from "@/lib/contracts";
import paths from "@/lib/paths";
import { allLanguageFeatures, allSupportedLanguages } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Lists",
};

interface ListStoreProps {
  params?: { language: string };
}

export async function generateStaticParams() {
  return allSupportedLanguages.map((lang) => ({ language: lang }));
}

export default async function ListStore({ params }: ListStoreProps) {
  const listStoreLanguage = params?.language as SupportedLanguage;
  if (!allSupportedLanguages.includes(listStoreLanguage))
    throw new Error(
      `Malformed URL, ${listStoreLanguage} is not a supported language`
    );
  const languageName = allLanguageFeatures.find(
    (lang) => lang.langCode === params?.language
  )?.langName;

  const response = await fetchListStoreDataForLanguage({
    language: listStoreLanguage,
  });
  if (!response.success) notFound();

  const { allListsForLanguage } = response.data;

  return (
    <div className="relative flex flex-col">
      <ListSearch languageName={languageName} />
      <div className="flex flex-wrap justify-center gap-4 overflow-y-auto px-6 py-4 pb-48 tablet:justify-start tablet:gap-6 desktop:gap-6 desktop:px-14">
        {allListsForLanguage.map((list) => (
          <ListStoreCard
            authorData={list.authorData}
            list={list}
            key={list.listNumber}
          />
        ))}
      </div>
      <Link href={paths.newListPath(params?.language as SupportedLanguage)}>
        <Button intent="bottomRightButton" aria-label="Create a new list">
          <FaPlus className="h-8 w-8 font-semibold text-white" />
        </Button>
      </Link>
    </div>
  );
}
