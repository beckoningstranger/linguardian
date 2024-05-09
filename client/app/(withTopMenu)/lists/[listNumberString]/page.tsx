import {
  getLanguageFeaturesForLanguage,
  getLearnedLanguageData,
  getPopulatedList,
  getUserById,
} from "@/app/actions";
import Link from "next/link";

import paths from "@/paths";
import getUserOnServer from "@/lib/getUserOnServer";
import ListHeader from "@/components/Lists/ListOverview/ListHeader";
import StartLearningListButton from "@/components/Lists/ListOverview/StartLearningListButton";

interface ListDetailProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListDetailPage({
  params: { listNumberString },
}: ListDetailProps) {
  const listNumber = parseInt(listNumberString);

  const listData = await getPopulatedList(listNumber);

  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (listData && listData.data && user) {
    const {
      name,
      description,
      authors,
      unitOrder,
      units,
      language,
      listNumber,
    } = listData.data;

    const languageFeatures = await getLanguageFeaturesForLanguage(language);
    const learnedLanguageData = await getLearnedLanguageData(user.id, language);

    const renderedUnits = unitOrder?.map((unitName, index) => {
      const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
        if (itemInUnit.unitName === unitName) a += 1;
        return a;
      }, 0);

      // IDEA: see how much the user has learned for each unit and calculate from- and to- values
      // for the gradient colors to visualize their progress
      return (
        <Link
          key={index}
          href={paths.unitDetailsPath(listNumber, index + 1)}
          className="flex w-full justify-center"
        >
          <div
            className={`${
              index % 2 === 0 &&
              "rounded-bl-[70px] rounded-tr-[70px] bg-gradient-to-tr"
            } ${
              index % 2 !== 0 &&
              "rounded-tl-[70px] rounded-br-[70px] bg-gradient-to-tl"
            } border border-slate-800 text-center py-6 shadow-lg hover:shadow-2xl w-11/12 flex justify-center bg-gradient-to-r from-slate-100 to-slate-100`}
          >
            {unitName}
          </div>
        </Link>
      );
    });

    const allLearnedListNumbers = learnedLanguageData?.learnedLists.map(
      (list) => list.listNumber
    );
    const listId = listData.data.listNumber;
    const userHasAddedThisList = allLearnedListNumbers?.includes(listId);

    const renderedAuthors = authors
      .map((author) => author.username)
      .join(" & ");

    if (renderedUnits && languageFeatures)
      return (
        <div id="container" className="md:mx-20 lg:mx-48 xl:mx-64 2xl:mx-96">
          <div className="flex flex-col">
            <ListHeader
              name={name}
              description={description}
              authors={renderedAuthors}
              numberOfItems={listData.data.units.length}
              image={listData.data.image}
              added={userHasAddedThisList}
            />
            <StartLearningListButton
              learnedLanguageData={learnedLanguageData}
              language={language}
              userId={user.id}
              listNumber={listNumber}
              languageName={languageFeatures.langName}
            />
            <div id="units" className="my-2 flex flex-col items-center gap-y-2">
              {renderedUnits}
            </div>
          </div>
        </div>
      );
  }

  return (
    <div>
      <h1>List not found</h1>
      <p>
        Either the list does not exist yet or there was a problem fetching it
        from the database.
      </p>
      <div>
        <Link href={paths.dashboardPath()}>Back to Dashboard</Link>
        <Link href={paths.listsPath()}>List Store</Link>
      </div>
    </div>
  );
}
