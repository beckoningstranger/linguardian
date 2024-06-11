import {
  FullyPopulatedList,
  ItemToLearn,
  LanguageFeatures,
  LearnedLanguageWithPopulatedLists,
  LearningMode,
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
  };
}

export default async function LearnAndReviewPage({
  params: { mode, listNumberString },
}: ReviewPageProps) {
  // Verify props
  const listNumber = parseInt(listNumberString);
  if (mode !== "translation" && mode !== "learn")
    return `No valid learning mode selected ${mode}`;

  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);
  if (!user) return "No User";

  const populatedListData = await getFullyPopulatedListByListNumber(
    user.native,
    listNumber
  );
  if (!populatedListData) return "Error getting populatedListData";

  const allItemStringsInList = populatedListData.units.map(
    (unitItem) => unitItem.item.name
  );

  const targetLanguageFeatures: LanguageFeatures | undefined =
    await getLanguageFeaturesForLanguage(populatedListData!.language);
  if (!targetLanguageFeatures) return "Error getting targetLanguageFeatures";

  // Fetch all items that user has learned for this language
  const learnedLanguageData = await getLearnedLanguageData(
    user.id,
    populatedListData.language
  );
  if (!learnedLanguageData) return "Error getting learnedLanguageData";

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
      userNative={user.native}
      userId={user.id}
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
