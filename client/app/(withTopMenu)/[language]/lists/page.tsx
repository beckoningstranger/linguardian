import Link from "next/link";

import BottomRightButton from "@/components/BottomRightButton";
import ListStoreCard from "@/components/Lists/ListStoreCard";
import {
  fetchAuthors,
  getListsByLanguage,
  getSupportedLanguages,
} from "@/lib/fetchData";
import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lists",
};

interface ListStoreProps {
  params?: { language: string };
}

export async function generateStaticParams() {
  const supportedLanguagesData = await getSupportedLanguages();
  if (!supportedLanguagesData)
    throw new Error("Could not get supported languages");
  return supportedLanguagesData.map((lang) => ({ language: lang }));
}

export default async function ListStore({ params }: ListStoreProps) {
  const listsForLanguage = await getListsByLanguage(
    params?.language as SupportedLanguage
  );

  if (!listsForLanguage) throw new Error("Invalid language");

  const renderedLists = listsForLanguage.map(async (list) => {
    const authorData = await fetchAuthors(list.authors);
    return (
      <ListStoreCard
        authorData={authorData}
        title={list.name}
        description={list.description}
        image={list.image}
        numberOfItems={list.units.length}
        numberOfUnits={list.unitOrder?.length}
        difficulty={list.difficulty}
        listNumber={list.listNumber}
        key={list.listNumber}
        language={list.language}
      />
    );
  });

  return (
    <>
      <div className="grid grid-cols-1 justify-center justify-items-center gap-4 py-4 md:grid-cols-2 md:justify-normal lg:grid-cols-3">
        {renderedLists}
      </div>
      <Link href={paths.newListPath(params?.language as SupportedLanguage)}>
        <BottomRightButton />
      </Link>
    </>
  );
}
