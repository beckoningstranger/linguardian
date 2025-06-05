import { Metadata } from "next";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import ListSearch from "@/components/Lists/ListStore/ListSearch";
import ListStoreCard from "@/components/Lists/ListStore/ListStoreCard";
import Button from "@/components/ui/Button";
import { fetchAuthors, getListsByLanguage } from "@/lib/fetchData";
import paths from "@/lib/paths";
import { siteSettings } from "@/lib/siteSettings";
import { SupportedLanguage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Lists",
};

interface ListStoreProps {
  params?: { language: string };
}

// export async function generateStaticParams() {
//   return siteSettings.supportedLanguages.map((lang) => ({ language: lang }));
// }

export default async function ListStore({ params }: ListStoreProps) {
  const [listsForLanguage] = await Promise.all([
    getListsByLanguage(params?.language as SupportedLanguage),
  ]);

  const renderedLists = listsForLanguage
    ? await Promise.all(
        listsForLanguage.map(async (list) => {
          const authorData = await fetchAuthors(list.authors);
          return (
            <ListStoreCard
              authorData={authorData}
              list={list}
              key={list.listNumber}
            />
          );
        })
      )
    : null;

  const languageFeature = siteSettings.languageFeatures.find(
    (lang) => lang.langCode === params?.language
  );

  return (
    <div className="relative flex flex-col">
      <ListSearch languageName={languageFeature?.langName} />
      <div className="fixed bottom-0 top-[236px] flex min-h-[calc(100vh-112px)] flex-wrap justify-center gap-4 overflow-y-auto px-6 py-4 pb-48 tablet:top-[244px] tablet:justify-start tablet:gap-6 desktop:gap-6 desktop:px-14">
        {renderedLists}
      </div>
      <Link href={paths.newListPath(params?.language as SupportedLanguage)}>
        <Button intent="bottomRightButton" aria-label="Create a new list">
          <FaPlus className="h-8 w-8 font-semibold text-white" />
        </Button>
      </Link>
    </div>
  );
}
