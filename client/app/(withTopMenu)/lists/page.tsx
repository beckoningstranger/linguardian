import Link from "next/link";

import { SupportedLanguage } from "@/types";
import {
  checkPassedLanguageAsync,
  getListsByLanguage,
  getUserById,
} from "@/app/actions";
import ListStoreCard from "@/components/ListStoreCard";

interface ListStoreProps {
  searchParams?: { lang: string };
}

export default async function ListStore({ searchParams }: ListStoreProps) {
  const user = await getUserById(1);
  const passedLanguage = searchParams?.lang?.toUpperCase() as SupportedLanguage;
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  const listsForLanguage = await getListsByLanguage(
    validPassedLanguage ? validPassedLanguage : user?.languages[0].code!
  );

  if (listsForLanguage) {
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
