import { ItemPopulatedWithTranslations, LanguageFeatures, User } from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import {
  getLanguageFeaturesForLanguage,
  getFullyPopulatedListByListNumber,
  getUserById,
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

  // Fetch items here
  const listData = await getFullyPopulatedListByListNumber(
    user!.native,
    listNumber
  );

  const targetLanguageFeatures: LanguageFeatures | undefined =
    await getLanguageFeaturesForLanguage(listData!.language);

  const items: ItemPopulatedWithTranslations[] = [];
  if (listData && listData.units) {
    listData.units.map((item) => items.push(item.item));
  }

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  if (targetLanguageFeatures && listData && listData.name && user)
    switch (mode) {
      case "translation":
        return (
          <TranslationMode
            targetLanguageFeatures={targetLanguageFeatures}
            items={items}
            listName={listData.name}
            userNative={user.native}
          />
        );
      case "learn":
        return <LearnNewWordsMode items={items} listName={listData.name} />;
      default:
        throw new Error("Unknown Learning Mode");
    }
}
