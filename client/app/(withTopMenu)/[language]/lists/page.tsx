import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import { SupportedLanguage } from "@/types";
import { fetchAuthors, getListsByLanguage } from "@/lib/fetchData";
import ListStoreCard from "@/components/Lists/ListStoreCard";
import paths from "@/paths";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lists",
};

interface ListStoreProps {
  params?: { language: string };
}

export default async function ListStore({ params }: ListStoreProps) {
  const listsForLanguage = await getListsByLanguage(
    params?.language as SupportedLanguage
  );

  if (listsForLanguage) {
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
      <div>
        <div className="grid grid-cols-1 justify-center justify-items-center gap-4 py-4 md:grid-cols-2 md:justify-normal lg:grid-cols-3">
          {renderedLists}
        </div>
        <Link
          href={paths.newListPath(params?.language as SupportedLanguage)}
          className="fixed bottom-1 right-1 m-2 grid h-16 w-16 place-items-center rounded-full border border-white bg-green-400 p-3"
        >
          <FaPlus className="text-2xl font-semibold text-white" />
        </Link>
      </div>
    );
  } else {
    return "Invalid language";
  }
}
