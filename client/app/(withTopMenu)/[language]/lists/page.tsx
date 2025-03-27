import Link from "next/link";

import ListStoreCard from "@/components/Lists/ListStoreCard";
import Button from "@/components/ui/Button";
import { fetchAuthors, getListsByLanguage } from "@/lib/fetchData";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { Metadata } from "next";

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
    <>
      <div className="grid grid-cols-1 justify-center justify-items-center gap-4 py-4 md:grid-cols-2 md:justify-normal lg:grid-cols-3">
        {renderedLists}
      </div>
      <Link href={paths.newListPath(params?.language as SupportedLanguage)}>
        <Button
          bottomRightButton
          intent="icon"
          aria-label="Create a new list"
        />
      </Link>
    </>
  );
}
