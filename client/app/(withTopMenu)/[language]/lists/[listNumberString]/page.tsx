import {
  fetchAuthors,
  getListDataForMetadata,
  getListNumbers,
  getPopulatedList,
} from "@/lib/fetchData";
import Link from "next/link";

import ListContainer from "@/components/Lists/ListContainer";
import ListFlexibleContent from "@/components/Lists/ListOverview/ListFlexibleContent";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import paths from "@/paths";
import { SupportedLanguage } from "@/types";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

export async function generateMetadata({ params }: ListDetailProps) {
  const listNumber = parseInt(params.listNumberString);

  const { listName, langName, description } = await getListDataForMetadata(
    listNumber,
    1
  );
  return {
    title: listName,
    description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
      description ? ` ${description}` : ""
    }"`,
  };
}

export async function generateStaticParams() {
  const listNumbers = await getListNumbers();
  if (!listNumbers) throw new Error("Failed to fetch all list numbers");
  return listNumbers?.map((number) => ({ listNumberString: number }));
}

interface ListDetailProps {
  params: {
    language: SupportedLanguage;
    listNumberString: string;
  };
}

export default async function ListDetailPage({
  params: { listNumberString, language },
}: ListDetailProps) {
  const listNumber = parseInt(listNumberString);

  const [listData] = await Promise.all([getPopulatedList(listNumber)]);

  if (listData) {
    const { name, description, authors, unitOrder, units, listNumber } =
      listData;

    const [authorData] = await Promise.all([fetchAuthors(authors)]);

    return (
      <ListContainer>
        <ListHeader
          name={name}
          description={description}
          authorData={authorData}
          numberOfItems={listData.units.length}
          image={listData.image}
        />
        <Suspense fallback={<Spinner />}>
          <ListFlexibleContent language={language} listNumber={listNumber} />
        </Suspense>
        <ListUnits
          unitOrder={unitOrder}
          units={units}
          listNumber={listNumber}
          language={language}
        />
      </ListContainer>
    );
  }
  if (!listData)
    return (
      <div>
        <h1>List or user not found</h1>
        <p>
          Either the list does not exist yet or there was a problem fetching it
          from the database. Make sure you are logged in.
        </p>
        <div>
          <Link href={paths.dashboardLanguagePath(language)}>
            Back to Dashboard
          </Link>
          <Link href={paths.listsLanguagePath(language)}>List Store</Link>
        </div>
      </div>
    );
}
