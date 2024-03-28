import {
  FullyPopulatedList,
  ItemToLearn,
  LanguageFeatures,
  LearnedItem,
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
} from "@/app/actions";

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

  const user: User | undefined = await getUserById(1);
  if (!user) return "No User";

  const listData = await getFullyPopulatedListByListNumber(
    user.native,
    listNumber
  );
  if (!listData) return "Error getting listData";

  const allItemStringsInList = listData.units.map(
    (unitItem) => unitItem.item.name
  );

  const targetLanguageFeatures: LanguageFeatures | undefined =
    await getLanguageFeaturesForLanguage(listData!.language);
  if (!targetLanguageFeatures) return "Error getting targetLanguageFeatures";

  // Fetch all items that user has learned for this language
  const learnedLanguageData = await getLearnedLanguageData(
    user.id,
    listData.language
  );
  if (!learnedLanguageData) return "Error getting learnedLanguageData";

  const itemsForSession = prepareItemsForSession(
    mode,
    user,
    listData,
    learnedLanguageData
  );

  return (
    <LearnAndReview
      targetLanguageFeatures={targetLanguageFeatures}
      items={itemsForSession}
      listName={listData.name}
      userNative={user.native}
      allItemStringsInList={allItemStringsInList}
      mode={mode}
    />
  );
}

function prepareItemsForSession(
  mode: LearningMode,
  user: User,
  listData: FullyPopulatedList,
  learnedLanguageData: LearnedLanguageWithPopulatedLists
): ItemToLearn[] {
  const languageDataForListLanguage = user.languages.find(
    (lang) => lang.code === listData.language
  );

  const learnedItems: LearnedItem[] | undefined =
    learnedLanguageData?.learnedItems;
  const allLearnedItemIds = learnedItems?.map((item) => item.id);

  const itemsPerSession =
    languageDataForListLanguage?.customSRSettings?.itemsPerSession;

  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemToLearn[] = [];
  listData.units.forEach((unitItem) => {
    if (!allLearnedItemIds?.includes(unitItem.item.id)) {
      const item = unitItem.item as ItemToLearn;
      item.learningStep = 0;
      item.firstPresentation = true;
      allLearnableItems.push(item);
    }
    // This should be just the else statement, but for now let's just put everything in
    // regardless of whether the items have been learned or are actually due to review
    // else {
    const item = unitItem.item as ItemToLearn;
    item.learningStep = 3;
    item.firstPresentation = false;
    allReviewableItems.push(item);
    // }
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
