import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import { SupportedLanguage } from "@/types";
import {
  checkPassedLanguageAsync,
  fetchAuthors,
  getListsByLanguage,
  getUserById,
} from "@/app/actions";
import ListStoreCard from "@/components/Lists/ListStoreCard";
import getUserOnServer from "@/lib/getUserOnServer";

interface ListStoreProps {
  searchParams?: { lang: string };
}

export default async function ListStore({ searchParams }: ListStoreProps) {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  const passedLanguage = searchParams?.lang?.toUpperCase() as SupportedLanguage;
  const validPassedLanguage = await checkPassedLanguageAsync(passedLanguage);
  const listsForLanguage = await getListsByLanguage(
    validPassedLanguage ? validPassedLanguage : user?.languages[0].code!
  );

  if (listsForLanguage) {
    const renderedLists = listsForLanguage.map(async (list) => {
      const authors = await fetchAuthors(list.authors);
      return (
        <ListStoreCard
          authors={authors}
          title={list.name}
          description={list.description}
          image={list.image}
          numberOfItems={list.units.length}
          numberOfUnits={list.unitOrder?.length}
          difficulty={list.difficulty}
          listNumber={list.listNumber}
          key={list.listNumber}
        />
      );
    });

    return (
      <div>
        <div className="grid grid-cols-1 justify-center justify-items-center gap-4 py-4 md:grid-cols-2 md:justify-normal lg:grid-cols-3">
          {renderedLists}
        </div>
        <Link
          href="/lists/new"
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
