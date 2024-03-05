"use client";
import useGlobalContext from "@/app/hooks/useGlobalContext";
import ListCard from "./ListCard";
import { ReactNode } from "react";
import AddNewListOption from "./Menus/AddNewListOption";

interface List {
  id: number;
  authorId: number;
  title: string;
  private: Boolean;
  items: number[][];
  description: string;
  stats: ListStats;
}

const fakeListsData: List[] = [
  {
    id: 1,
    authorId: 1,
    title: "Example course 1",
    private: false,
    items: [[1, 3, 4, 6]],
    description: "Example course 1 description",
    // These stats will be calculated after fetching the list from the server
    stats: {
      unlearned: 20,
      readyToReview: 0,
      learned: 50,
      learning: 40,
      ignored: 3,
    },
  },
  {
    id: 2,
    authorId: 2,
    title: "Example course 2 with a long course title",
    private: false,
    items: [[2, 4, 5]],
    description: "Example course 2 description",
    // These stats will be calculated after fetching the list from the server
    stats: {
      unlearned: 20,
      readyToReview: 33,
      learned: 50,
      learning: 20,
      ignored: 3,
    },
  },
  {
    id: 3,
    authorId: 2,
    title: "Example course 3",
    private: false,
    items: [[2, 4, 5]],
    description: "Example course 2 description",
    // These stats will be calculated after fetching the list from the server
    stats: {
      unlearned: 20,
      readyToReview: 33,
      learned: 0,
      learning: 40,
      ignored: 3,
    },
  },
];

export interface ListStats {
  unlearned: number;
  readyToReview: number;
  learned: number;
  learning: number;
  ignored: number;
}

export default function Dashboard() {
  const { currentlyActiveLanguage, user } = useGlobalContext();

  let learnedLists: number[] = [];
  let currentLanguageIndex: number = 0;

  let renderedLists: ReactNode;

  // Check what index number of the user object the currently active language has
  user.languages.map((language, index) => {
    if (language.code === currentlyActiveLanguage) {
      currentLanguageIndex = index;
    }
  });

  // Get all the learned lists for the currently active language
  if (user.languages[currentLanguageIndex].code === currentlyActiveLanguage) {
    user.languages[currentLanguageIndex].learnedListIds.map((list) =>
      learnedLists.push(list)
    );
  }

  if (learnedLists.length > 0) {
    // for currently selected language, fetch list data for lists that user has already added
    // fetched data should be an array of lists that we can map over below (right now fakeListsData)
    // await .... lists based on user.languages[currentLanguageIndex].learnedListIds
    // We'll get a list that we can simply map over without checking anything.
    // SELECT * from Lists WHERE list.id equals [learnedLists]
    // The current code assumes we fetch ALL lists, but this will not be efficient, instead we will fetch only the specific
    // lists that the user has learned.

    renderedLists = fakeListsData.map((list) => {
      if (learnedLists.includes(list.id)) {
        // Here, or preferably earlier, is where we need to figure out how many items are due to review and if there are items to add
        // so we can pass this information down
        // Possible statuses are "review", "add" and "practice"
        return (
          <ListCard
            key={list.id}
            id={list.id}
            title={list.title}
            stats={list.stats}
            status="practice"
          />
        );
      }
    });
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
