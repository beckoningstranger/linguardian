import {
  fetchAuthors,
  getListDataForMetadata,
  getPopulatedList,
  getUserById,
} from "@/lib/fetchData";

import ListContainer from "@/components/Lists/ListContainer";
import DeleteListButton from "@/components/Lists/ListOverview/DeleteListButton";
import ListFlexibleContent from "@/components/Lists/ListOverview/ListFlexibleContent";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import ListUnits from "@/components/Lists/ListOverview/ListUnits";
import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";
import Spinner from "@/components/Spinner";
import { getUserOnServer } from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";
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

  const [listData, sessionUser] = await Promise.all([
    getPopulatedList(listNumber),
    getUserOnServer(),
  ]);
  if (!listData) notFound();

  const { name, description, authors, unitOrder, units } = listData;

  const [authorData, fullUser] = await Promise.all([
    fetchAuthors(authors),
    getUserById(sessionUser.id),
  ]);

  const userIsAuthor = listData.authors.includes(sessionUser.id);
  const learnedItemsForListLanguage = fullUser?.languages.find(
    (lang) => lang.code === listData.language
  )?.learnedItems;

  return (
    <ListContainer>
      <MobileMenuContextProvider>
        <DeleteListButton
          listNumber={listNumber}
          listLanguage={language}
          listName={name}
        />
      </MobileMenuContextProvider>
      <ListHeader
        name={name}
        description={description}
        authorData={authorData}
        numberOfItems={listData.units.length}
        image={listData.image}
        listNumber={listNumber}
        userIsAuthor={userIsAuthor}
      />
      <Suspense
        fallback={
          <div className="grid w-full place-items-center">
            <Spinner />
          </div>
        }
      >
        <ListFlexibleContent language={language} list={listData} />
      </Suspense>
      <ListUnits
        unitOrder={unitOrder}
        units={units}
        listNumber={listNumber}
        language={language}
        userIsAuthor={userIsAuthor}
        learnedItemsForListLanguage={learnedItemsForListLanguage}
      />
    </ListContainer>
  );
}
