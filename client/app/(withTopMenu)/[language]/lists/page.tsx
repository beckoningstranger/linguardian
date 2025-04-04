import Link from "next/link";
import { Metadata } from "next";

import { fetchAuthors, getListsByLanguage } from "@/lib/fetchData";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import Button from "@/components/ui/Button";
import ListStoreCard from "@/components/Lists/ListStoreCard";
import ListSearch from "@/components/Lists/ListSearch";
import { FaPlus } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Lists",
};

interface ListStoreProps {
  params?: { language: string };
}

// export async function generateStaticParams() {
//   const supportedLanguagesData = await getSupportedLanguages();
//   return supportedLanguagesData
//     ? supportedLanguagesData.map((lang) => ({ language: lang }))
//     : [];
// }

export default async function ListStore({ params }: ListStoreProps) {
  const listsForLanguage = await getListsByLanguage(
    params?.language as SupportedLanguage
  );

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

  return (
    <div className="flex flex-col">
      <ListSearch />
      <div className="flex flex-wrap justify-center gap-4 px-6 py-4 tablet:justify-start tablet:gap-6 desktop:gap-6 desktop:px-14">
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
