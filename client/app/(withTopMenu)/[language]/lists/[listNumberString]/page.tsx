import {
  fetchAuthors,
  getListDataForMetadata,
  getPopulatedList,
} from "@/lib/fetchData";

import ListContainer from "@/components/Lists/ListContainer";
import ListFlexibleContent from "@/components/Lists/ListOverview/ListFlexibleContent";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import Spinner from "@/components/Spinner";
import { SupportedLanguage } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ params }: ListDetailProps) {
  const listNumber = parseInt(params.listNumberString);

  const listData = await getListDataForMetadata(listNumber, 1);
  const { listName, langName, description } = listData;
  return {
    title: listName,
    description: `Learn ${langName} and enrich your vocabulary by memorizing Linguardian's list "${listName}.${
      description ? ` ${description}` : ""
    }"`,
  };
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

  if (listData?.name) {
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
        <Suspense fallback={<Spinner size={8} />}>
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
  if (!listData) notFound();
}
