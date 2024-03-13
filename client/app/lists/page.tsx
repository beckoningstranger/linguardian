import Link from "next/link";

import { PopulatedList, SupportedLanguage } from "@/types";
import { getListsByLanguage, getSupportedLanguages } from "../actions";
import ListStoreCard from "@/components/ListStoreCard";

interface ListStoreProps {
  // searchParams?: { [key: string]: string | string[] | undefined };
  searchParams?: { lang: SupportedLanguage };
}

export default async function ListStore({ searchParams }: ListStoreProps) {
  // Make sure passed language is a supported language
  const supportedLanguages = (await getSupportedLanguages()) as string[];
  const passedLanguage = searchParams?.lang?.toUpperCase() as SupportedLanguage;
  const listsForLanguage = await getListsByLanguage(passedLanguage);

  if (
    passedLanguage &&
    supportedLanguages &&
    supportedLanguages.includes(passedLanguage) &&
    listsForLanguage
  ) {
    const renderedLists = listsForLanguage.map((list) => (
      <ListStoreCard
        authors={list.authors}
        title={list.name}
        description={list.description}
        image={list.image}
        numberOfItems={list.units.length}
        numberOfUnits={list.unitOrder?.length}
        difficulty={list.difficulty}
        listNumber={list.listNumber}
        key={list.listNumber}
      />
    ));

    return (
      <div>
        <div className="m-3 grid justify-center p-2 md:justify-normal">
          {renderedLists}
        </div>
        <div>
          <Link
            href="/lists/new"
            className="absolute bottom-1 left-1 m-4 rounded border border-black bg-slate-200 p-3"
          >
            Upload CSV
          </Link>
        </div>
      </div>
    );
  } else {
    return "Invalid language";
  }
}
