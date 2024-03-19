import ListDashboardCard from "./ListDashboardCard";
import { ReactNode } from "react";
import Link from "next/link";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import {
  LearnedLanguageWithPopulatedLists,
  ListWithStats,
  SupportedLanguage,
  User,
} from "@/types";
import { getLearnedLanguageData } from "@/app/actions";

const fakeListsData: ListWithStats[] = [
  {
    listNumber: 1,
    authors: ["Joe"],
    name: "Example list 1",
    private: false,
    language: "FR",
    description: "Example list 1 description",
    // These stats will be calculated after fetching the list from the server
    stats: {
      unlearned: 20,
      readyToReview: 0,
      learned: 50,
      learning: 40,
      ignored: 3,
    },
  },
  // {
  //   listNumber: 2,
  //   authors: ["Joe"],
  //   name: "Example list 2 with a long list title",
  //   private: false,
  //   language: "DE",
  //   description: "Example list 2 description",
  //   // These stats will be calculated after fetching the list from the server
  //   stats: {
  //     unlearned: 20,
  //     readyToReview: 33,
  //     learned: 50,
  //     learning: 20,
  //     ignored: 3,
  //   },
  // },
  // {
  //   listNumber: 3,
  //   authors: ["Joe"],
  //   name: "Example list 3",
  //   private: false,
  //   language: "FR",
  //   description: "Example list 2 description",
  //   // These stats will be calculated after fetching the list from the server
  //   stats: {
  //     unlearned: 20,
  //     readyToReview: 33,
  //     learned: 0,
  //     learning: 40,
  //     ignored: 3,
  //   },
  // },
];

interface DashboardProps {
  user: User;
  currentlyActiveLanguage: SupportedLanguage;
}

export default async function Dashboard({
  user,
  currentlyActiveLanguage,
}: DashboardProps) {
  let learnedLists: ListWithStats[] = [];
  let renderedLists: ReactNode;

  // Get all the learned lists for the currently active language
  const userLearningDataForActiveLanguage:
    | LearnedLanguageWithPopulatedLists
    | undefined = await getLearnedLanguageData(
    user.id,
    currentlyActiveLanguage
  );

  // Now compute the stats for the fetched lists

  fakeListsData.map((list) => learnedLists.push(list));

  if (learnedLists.length > 0) {
    // for currently selected language, fetch list data for lists that user has already added
    // fetched data should be an array of lists that we can map over below (right now fakeListsData)
    // await .... lists based on user.languages[currentLanguageIndex].learnedListIds
    // We'll get a list that we can simply map over without checking anything.
    // SELECT * from Lists WHERE list.id equals [learnedLists]
    // The current code assumes we fetch ALL lists, but this will not be efficient, instead we will fetch only the specific
    // lists that the user has learned.

    renderedLists = fakeListsData.map((list) => {
      // This check needs to be done with ObjectIds once we have that data on the user
      // if (learnedLists.includes(list.id)) {
      // Here, or preferably earlier, is where we need to figure out how many items are due to review and if there are items to add
      // so we can pass this information down
      // Possible statuses are "review", "add" and "practice"
      return (
        <ListDashboardCard
          key={list.listNumber}
          id={list.listNumber}
          title={list.name}
          stats={list.stats}
          status="practice"
        />
      );
      // }
    });
  }

  function AddNewListOption() {
    return (
      <Link
        href={`/app/lists?lang=${currentlyActiveLanguage}`}
        className="relative mx-6 flex h-full min-h-40 items-center justify-center rounded-md bg-slate-200 md:min-h-80 lg:mx-3 xl:mx-6"
      >
        <div className="flex size-4/5 items-center justify-center rounded-md bg-slate-100 text-6xl text-slate-600 transition-all hover:scale-110 md:text-8xl">
          <HiOutlinePlusCircle />
        </div>
      </Link>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="grid w-full max-w-xl grid-cols-1 items-stretch justify-center gap-y-3 py-4 md:max-w-full md:grid-cols-2 lg:grid-cols-3 2xl:mx-8 2xl:max-w-[1500px] 2xl:gap-x-6">
        {renderedLists}
        <AddNewListOption />
      </div>
    </div>
  );
}
