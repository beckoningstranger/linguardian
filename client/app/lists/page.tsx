import axios, { AxiosError } from "axios";
import Link from "next/link";

import { PopulatedList, SupportedLanguage } from "@/types";

interface ListStoreProps {
  searchParams: { lang: string };
}

export default async function ListStore({ searchParams }: ListStoreProps) {
  const language = searchParams.lang.toUpperCase() as SupportedLanguage;

  async function fetchListsByLanguage(language: SupportedLanguage) {
    "use server";
    try {
      const { data } = await axios.get(
        `http://localhost:8000/lists/getAll/${language}`
      );
      const fetchedLists = data;
      return fetchedLists;
    } catch (err) {
      if (err instanceof AxiosError) {
        return { message: err.response?.data.message };
      } else return { message: "Something went wrong" };
    }
  }

  const data = (await fetchListsByLanguage(language)) as PopulatedList[];

  const renderedLists = data.map((list) => (
    <Link href={`/lists/${list.listNumber}`} key={list.listNumber}>
      {list.name} ({list.units.length} items to learn)
    </Link>
  ));

  console.log(data);

  return (
    <div className="m-3 flex flex-col p-2">
      <p className="m-4">List Store</p>

      <div className="m-4">
        <Link
          href="/lists/new"
          className="m-2 rounded border border-black bg-slate-200 p-3"
        >
          Upload CSV
        </Link>
      </div>
      <div>Our lists for this language:</div>
      <div>{renderedLists}</div>
    </div>
  );
}
