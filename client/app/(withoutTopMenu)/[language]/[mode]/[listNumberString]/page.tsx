import {
  FullyPopulatedList,
  ItemToLearn,
  LearnedLanguageWithPopulatedLists,
  LearningMode,
  SupportedLanguage,
  User,
} from "@/types";
import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import {
  getLanguageFeaturesForLanguage,
  getFullyPopulatedListByListNumber,
  getUserById,
  getLearnedLanguageData,
  getListName,
  getSupportedLanguages,
  getLearningModes,
  getListNumbers,
} from "@/lib/fetchData";
import getUserOnServer from "@/lib/getUserOnServer";
import { notFound } from "next/navigation";
import NavigateBackButton from "@/components/NavigateBackButton";

export async function generateMetadata({ params }: ReviewPageProps) {
  const listNumber = parseInt(params.listNumberString);
  const listName = await getListName(listNumber);
  return { title: listName };
}

export async function generateStaticParams() {
  const [supportedLanguages, learningModes, listNumbers] = await Promise.all([
    getSupportedLanguages(),
    getLearningModes(),
    getListNumbers(),
  ]);

  let possibilities: {
    language: SupportedLanguage;
    mode: LearningMode;
    listNumberString: string;
  }[] = [];

  supportedLanguages?.forEach((lang) =>
    learningModes?.forEach((mode) =>
      listNumbers?.forEach((number) =>
        possibilities.push({
          language: lang,
          mode: mode,
          listNumberString: number,
        })
      )
    )
  );
  return possibilities;
}

interface ReviewPageProps {
  params: {
    mode: string;
    listNumberString: string;
    language: SupportedLanguage;
  };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString, language },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);
  if (mode !== "translation" && mode !== "learn")
    return (
      <div className="grid place-items-center h-screen">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-2xl mb-5">
            Sorry, we could not create a learning session!
          </h1>
          <p>
            No valid learning mode selected. Mode &apos;{mode}&apos; either does
            not exist or has not been unlocked for this list.
          </p>
          <NavigateBackButton className="w-52 mt-4 bg-slate-200 p-4 rounded-md">
            Navigate Back
          </NavigateBackButton>
        </div>
      </div>
    );
  // throw new Error(
  //   `No valid learning mode selected. Mode '${mode}' either does not exist or has not been unlocked for this list.`
  // );
  const sessionUser = await getUserOnServer();

  const [user, populatedListData, targetLanguageFeatures, learnedLanguageData] =
    await Promise.all([
      getUserById(sessionUser.id),
      getFullyPopulatedListByListNumber(sessionUser.native.name, listNumber),
      await getLanguageFeaturesForLanguage(language),
      await getLearnedLanguageData(sessionUser.id, language),
    ]);
  if (
    !user ||
    !populatedListData ||
    !targetLanguageFeatures ||
    !learnedLanguageData
  )
    notFound();

  const allItemStringsInList = populatedListData.units.map(
    (unitItem) => unitItem.item.name
  );
  const itemsForSession = prepareItemsForSession(
    mode,
    user,
    populatedListData,
    learnedLanguageData
  );

  return (
    <LearnAndReview
      targetLanguageFeatures={targetLanguageFeatures}
      items={itemsForSession}
      listName={populatedListData.name}
      userNative={sessionUser.native.name}
      userId={sessionUser.id}
      allItemStringsInList={allItemStringsInList}
      mode={mode}
    />
  );
}

function prepareItemsForSession(
  mode: LearningMode,
  user: User,
  populatedListData: FullyPopulatedList,
  learnedLanguageData: LearnedLanguageWithPopulatedLists
): ItemToLearn[] {
  const languageDataForListLanguage = user.languages.find(
    (lang) => lang.code === populatedListData.language
  );

  const itemsPerSession =
    languageDataForListLanguage?.customSRSettings?.itemsPerSession;

  const allLearnedItemIds = learnedLanguageData.learnedItems.map(
    (item) => item.id
  );

  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemToLearn[] = [];
  populatedListData.units.forEach((unitItem) => {
    if (mode === "learn" && !allLearnedItemIds.includes(unitItem.item._id)) {
      const item = unitItem.item as ItemToLearn;
      item.learningStep = 0;
      item.increaseLevel = true;
      item.firstPresentation = true;
      allLearnableItems.push(item);
    }
    if (
      mode === "translation" &&
      allLearnedItemIds.includes(unitItem.item._id)
    ) {
      const item = unitItem.item as ItemToLearn;
      item.learningStep = 3;
      item.firstPresentation = false;
      item.increaseLevel = true;
      allReviewableItems.push(item);
    }
  });

  let itemsForSession: ItemToLearn[] = [];
  switch (mode) {
    case "translation":
      itemsForSession = allReviewableItems.slice(0, itemsPerSession?.reviewing);
      break;
    case "learn":
      itemsForSession = allLearnableItems.slice(0, itemsPerSession?.learning);
      break;
    default:
      console.error("No valid learning mode");
  }

  return itemsForSession;
}
