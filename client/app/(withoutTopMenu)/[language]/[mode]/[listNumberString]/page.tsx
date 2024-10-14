import LearnAndReview from "@/components/LearningModes/LearnAndReview";
import NavigateBackButton from "@/components/NavigateBackButton";
import {
  getDefaultSRSettings,
  getFullyPopulatedListByListNumber,
  getLanguageFeaturesForLanguage,
  getLearningModes,
  getListName,
  getListNumbers,
  getSupportedLanguages,
} from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import {
  FullyPopulatedList,
  ItemToLearn,
  LearningMode,
  SRSettings,
  SupportedLanguage,
} from "@/lib/types";
import { notFound } from "next/navigation";

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
      <div className="grid h-screen place-items-center">
        <div className="flex flex-col items-center">
          <h1 className="mb-5 text-center text-2xl">
            Sorry, we could not create a learning session!
          </h1>
          <p>
            No valid learning mode selected. Mode &apos;{mode}&apos; either does
            not exist or has not been unlocked for this list.
          </p>
          <NavigateBackButton className="mt-4 w-52 rounded-md bg-slate-200 p-4">
            Navigate Back
          </NavigateBackButton>
        </div>
      </div>
    );

  const user = await getUserOnServer();

  const [populatedListData, targetLanguageFeatures, defaultSRSettings] =
    await Promise.all([
      getFullyPopulatedListByListNumber(user.native.code, listNumber),
      getLanguageFeaturesForLanguage(language),
      getDefaultSRSettings(),
    ]);
  if (!populatedListData || !targetLanguageFeatures || !defaultSRSettings)
    notFound();

  const SRSettingsForLanguage = user?.customSRSettings
    ? user.customSRSettings[language]
    : defaultSRSettings;
  const allItemStringsInList = populatedListData.units.map(
    (unitItem) => unitItem.item.name
  );
  const itemsForSession = prepareItemsForSession(
    mode,
    SRSettingsForLanguage,
    populatedListData
  );

  return (
    <LearnAndReview
      targetLanguageFeatures={targetLanguageFeatures}
      items={itemsForSession}
      listName={populatedListData.name}
      userNative={user.native.code}
      userId={user.id}
      allItemStringsInList={allItemStringsInList}
      mode={mode}
    />
  );
}

function prepareItemsForSession(
  mode: LearningMode,
  SRSettingsForLanguage: SRSettings,
  populatedListData: FullyPopulatedList
): ItemToLearn[] {
  const allLearnableItems: ItemToLearn[] = [];
  const allReviewableItems: ItemToLearn[] = [];
  populatedListData.units.forEach((unitItem) => {
    const item = unitItem.item as ItemToLearn;
    item.increaseLevel = true;
    if (mode === "learn") {
      item.learningStep = 0;
      item.firstPresentation = true;
      allLearnableItems.push(item);
    }
    if (mode === "translation") {
      item.learningStep = 3;
      item.firstPresentation = false;
      allReviewableItems.push(item);
    }
  });

  let itemsForSession: ItemToLearn[] = [];
  switch (mode) {
    case "translation":
      itemsForSession = allReviewableItems.slice(
        0,
        SRSettingsForLanguage.itemsPerSession?.reviewing
      );
      break;
    case "learn":
      itemsForSession = allLearnableItems.slice(
        0,
        SRSettingsForLanguage.itemsPerSession?.learning
      );
      break;
    default:
      console.error("No valid learning mode");
  }

  return itemsForSession;
}
