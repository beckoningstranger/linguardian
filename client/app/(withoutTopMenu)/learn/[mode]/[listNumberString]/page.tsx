import {
  ItemPopulatedWithTranslations,
  ItemToLearn,
  LanguageFeatures,
  User,
} from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
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

export default async function ReviewPage({
  params: { mode, listNumberString },
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);

  const user: User | undefined = await getUserById(1);
  const userNative = user!.native;

  // Fetch list here
  const listData = await getFullyPopulatedListByListNumber(
    userNative,
    listNumber
  );

  // Fetch all items that user has learned for this language
  const learnedLanguageData = await getLearnedLanguageData(
    user!.id,
    listData!.language
  );

  const learnedItems = learnedLanguageData?.learnedItems;
  const languageDataForListLanguage = user?.languages.find(
    (lang) => lang.code === listData?.language
  );

  const allLearnedItemIds = learnedItems?.map((item) => item.id);

  const itemsPerSession =
    languageDataForListLanguage?.customSRSettings?.itemsPerSession;

  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemPopulatedWithTranslations[] = [];
  listData!.units.forEach((unitItem) => {
    if (!allLearnedItemIds?.includes(unitItem.item.id)) {
      const item = unitItem.item as ItemToLearn;
      item.learningStep = 0;
      allLearnableItems.push(item);
    } else {
      allReviewableItems.push(unitItem.item);
    }
  });

  const targetLanguageFeatures: LanguageFeatures | undefined =
    await getLanguageFeaturesForLanguage(listData!.language);

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  if (targetLanguageFeatures && listData && listData.name && listData.units)
    switch (mode) {
      case "translation":
        const itemsToReview: ItemToLearn[] = allLearnableItems;
        // Include check whether this item is due for review
        const itemsForNextSession = itemsToReview.slice(
          0,
          itemsPerSession!.reviewing
        );
        return (
          <TranslationMode
            targetLanguageFeatures={targetLanguageFeatures}
            items={itemsForNextSession}
            listName={listData.name}
            userNative={userNative}
          />
        );
      case "learn":
        const itemsToLearn = allLearnableItems.slice(
          0,
          itemsPerSession!.learning
        );

        return (
          <LearnNewWordsMode
            listName={listData.name}
            items={itemsToLearn}
            userNative={userNative}
            targetLanguageFeatures={targetLanguageFeatures}
          />
        );
      default:
        throw new Error("Unknown Learning Mode");
    }
}
