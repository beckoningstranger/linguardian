import useGlobalContext from "@/app/hooks/useGlobalContext";
import ListCard from "./ListCard";
import { ReactNode } from "react";

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

interface LearnedItem {
  itemId: number;
  itemLevel: number;
  nextReview: Date;
  // itemHistory
}

const defaultReviewTimes = {
  1: 4 * 60 * 60 * 1000, // Level 1: 4 hours
  2: 10 * 60 * 60 * 1000, // 10 hours
  3: 24 * 60 * 60 * 1000, // 1 day
  4: 2 * 24 * 60 * 60 * 1000, // 2 days
  5: 4 * 24 * 60 * 60 * 1000, // 4 days
  6: 8 * 24 * 60 * 60 * 1000, // 8 days
  7: 14 * 24 * 60 * 60 * 1000, // 14 days
  8: 30 * 24 * 60 * 60 * 1000, // 1 month
  9: 90 * 24 * 60 * 60 * 1000, // 3 months
  10: 180 * 24 * 60 * 60 * 1000, // 6 months
};

const defaultItemsPerSession = { learning: 5, reviewing: 20 };

interface SSRSettings {
  reviewTimes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
  };
  itemsPerSession: { learning: number; reviewing: number };
}

interface LearnedLanguage {
  name: string;
  learnedItems: LearnedItem[];
  learnedListIds: number[];
  SSRSettings: SSRSettings;
}

interface Addendum {}

interface LearningHistory {}

interface Settings {}

interface Credentials {}

interface Profile {}

interface User {
  id: number;
  alias: string;
  native: string; // maybe use an enum here. This should be the same 2 or 3-letter combinations we use for flags, i.e. GB, NOR, FR, CN, etc.
  languages?: LearnedLanguage[];
  addendums?: Addendum[];
  learningHistory?: LearningHistory;
  settings: Settings;
  credentials: Credentials;
  profile: Profile;
}

const user1: User = {
  id: 1,
  alias: "User1",
  native: "DE",
  languages: [
    {
      name: "GB",
      learnedListIds: [1, 2],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
    {
      name: "FR",
      learnedListIds: [1, 2, 3],
      learnedItems: [
        { itemId: 1, itemLevel: 1, nextReview: new Date() },
        { itemId: 3, itemLevel: 1, nextReview: new Date() },
        { itemId: 4, itemLevel: 1, nextReview: new Date() },
      ],
      SSRSettings: {
        reviewTimes: defaultReviewTimes,
        itemsPerSession: defaultItemsPerSession,
      },
    },
  ],
  addendums: [{}],
  learningHistory: {},
  settings: {},
  credentials: {},
  profile: {},
};

export default function Dashboard() {
  const user = user1;
  const { currentlyActiveLanguage } = useGlobalContext();

  let learnedLists: number[] = [];
  let currentLanguageIndex: number = 0;

  let renderedLists: ReactNode | string = "No lists learned yet";

  // Check what index number of the user object the currently active language has
  if (user.languages)
    user.languages.map((language, index) => {
      if (language.name === currentlyActiveLanguage) {
        currentLanguageIndex = index;
      }
    });

  // Get all the learned lists for the currently active language
  if (
    user.languages &&
    user.languages[currentLanguageIndex].name === currentlyActiveLanguage
  ) {
    user.languages[currentLanguageIndex].learnedListIds.map((list) =>
      learnedLists.push(list)
    );
  }

  if (user.languages && learnedLists.length > 0) {
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
      <div className="grid grid-cols-1 max-w-xl md:max-w-full 2xl:max-w-[1500px] 2xl:mx-8 2xl:gap-x-6 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch w-full mt-20 py-4 gap-y-3">
        {renderedLists}
      </div>
    </div>
  );
}
