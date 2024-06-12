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
} from "@/app/actions";
import getUserOnServer from "@/lib/getUserOnServer";

export async function generateMetadata({ params }: ReviewPageProps) {
  const listNumber = parseInt(params.listNumberString);
  const listName = await getListName(listNumber);
  return { title: listName };
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
    return `No valid learning mode selected ${mode}`;
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
    return "Error getting data";

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
