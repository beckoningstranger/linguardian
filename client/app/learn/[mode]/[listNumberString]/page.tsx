import { ItemsPopulatedWithTranslations, SupportedLanguage } from "@/types";
import LearnNewWordsMode from "@/components/LearningModes/LearnNewWordsMode";
import TranslationMode from "@/components/LearningModes/TranslationMode";
import {
  getLanguageFeaturesForLanguage,
  getOnePopulatedListByListNumber,
} from "@/app/actions";

interface ReviewPageProps {
  params: {
    mode: string;
    listNumberString: string;
  };
  targetLanguage: SupportedLanguage;
}

export default async function ReviewPage({
  params: { mode, listNumberString },
  targetLanguage,
}: ReviewPageProps) {
  const listNumber = parseInt(listNumberString);
  const targetLanguageFeatures = await getLanguageFeaturesForLanguage(
    targetLanguage
  );

  const items: ItemsPopulatedWithTranslations[] = [];

  // Fetch items here
  const listData = await getOnePopulatedListByListNumber(listNumber);

  // console.log(listData?.units.map((x) => x.item.translations?.DE));
  // console.log(listData?.units[0].item.translations?.DE);
  // const items: ItemsPopulatedWithTranslations = [];
  // if (listData && listData.units) listData?.units.map((item) => item.item);

  // This is where we read the list data to see what items need to be reviewed / can be learned
  // and then fetch all of them to then pass this information on into a Learning Mode.
  if (targetLanguageFeatures && listData && listData.name)
    switch (mode) {
      case "translation":
        <TranslationMode
          targetLanguageFeatures={targetLanguageFeatures}
          items={items}
          listName={listData.name}
        />;
      case "learn":
        return <LearnNewWordsMode items={items} listName={listData.name} />;
      default:
        throw new Error("Unknown Learning Mode");
    }
}
