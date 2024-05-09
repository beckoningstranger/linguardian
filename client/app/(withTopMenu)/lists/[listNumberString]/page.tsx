import {
  getLanguageFeaturesForLanguage,
  getLearnedLanguageData,
  getPopulatedList,
  getUserById,
} from "@/app/actions";
import { LearnedLanguageWithPopulatedLists } from "@/types";
import Image from "next/image";
import Link from "next/link";

import paths from "@/paths";
import getUserOnServer from "@/lib/getUserOnServer";

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
      description = "No description entered yet... but this is text that could get quite long. I might even get to three or four lines. Or maybe even longer, who knows? Some people ramble on and on.",
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

    // Calculate how many words the user already knows
    const allLearnedItemIds = learnedLanguageData?.learnedItems.map(
      (item) => item.id
    );
    const allItemIdsFromList = listData.data.units.map((item) => item.item._id);
    const allLearnedItemsFromList = allItemIdsFromList.filter((id) =>
      allLearnedItemIds?.includes(id)
    );
    const learned = allLearnedItemsFromList.length;

    if (renderedUnits && languageFeatures)
      return (
        <div className="flex flex-col">
          {!learnedLanguageData && (
            <Link
              href={`/lists/add?lang=${language}&user=${user.id}&list=${listNumber}&newLanguage=yes`}
              className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
            >
              Start learning {languageFeatures.langName} with this list!
            </Link>
          )}
          {learnedLanguageData &&
            userIsNotAlreadyLearningThisList(
              learnedLanguageData,
              listNumber
            ) && (
              <Link
                href={`/lists/add?lang=${language}&user=${user.id}&list=${listNumber}`}
                className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
              >
                Add this list to your dashboard
              </Link>
            )}
          <div
            id="header"
            className="relative flex border-y-2 border-slate-300"
          >
            <Image
              src="https://picsum.photos/200?grayscale"
              alt="List image"
              height={200}
              width={200}
              className="w-1/3 md:w-1/6"
              priority
            />
            <div className="flex w-2/3 flex-col items-center justify-center md:w-5/6">
              <div className="flex flex-col">
                <h1 className="mb-2 flex justify-center text-2xl sm:m-2">
                  {name}
                </h1>
                <h3 className="mx-2 text-sm sm:mx-6">{description}</h3>
              </div>
              <h5 className="absolute bottom-1 right-3 text-xs">
                created by{" "}
                {authors.map((author) => author.username).join(" & ")}
              </h5>
            </div>
          </div>
          <div id="progress" className="m-3 text-center text-xl">
            {learned} / {units.length} words learned
          </div>
          <div id="units" className="flex flex-col items-center gap-y-2">
            {renderedUnits}
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

function userIsNotAlreadyLearningThisList(
  learnedLanguageData: LearnedLanguageWithPopulatedLists | undefined,
  listNumber: number
) {
  if (learnedLanguageData) {
    const allListNumberssLearnedByUser: number[] =
      learnedLanguageData.learnedLists.map((list) => list.listNumber);
    if (allListNumberssLearnedByUser.includes(listNumber)) return false;
  }

  return true;
}
