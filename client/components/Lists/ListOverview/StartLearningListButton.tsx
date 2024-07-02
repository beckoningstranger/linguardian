import { addListForNewLanguage, addListToDashboard } from "@/lib/actions";
import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";
import AddListSubmitButton from "./AddListSubmitButton";

interface StartLearningListButtonProps {
  language: SupportedLanguage;
  listNumber: number;
}

export default async function StartLearningListButton({
  language,
  listNumber,
}: StartLearningListButtonProps) {
  const sessionUser = await getUserOnServer();
  const languageFeatures = await getLanguageFeaturesForLanguage(language);
  if (!languageFeatures || !sessionUser)
    throw new Error("Failed to fetch language features or session");

  let userIsLearningThisLanguage = false;
  sessionUser.isLearning.forEach((lang) => {
    if (lang.name === language) userIsLearningThisLanguage = true;
  });

  const { langName } = languageFeatures;
  const addListToDashboardAction = addListToDashboard.bind(
    null,
    listNumber,
    language,
    sessionUser.id
  );

  const addListForNewLanguageAction = addListForNewLanguage.bind(
    null,
    sessionUser.id,
    language,
    listNumber
  );

  return (
    <>
      {!userIsLearningThisLanguage && (
        <form
          action={addListForNewLanguageAction}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          <AddListSubmitButton language={language} listNumber={listNumber}>
            Start learning {langName} with this list!
          </AddListSubmitButton>
        </form>
      )}
      {userIsLearningThisLanguage && (
        <form
          action={addListToDashboardAction}
          className="m-2 rounded-md bg-green-500 p-4 text-center text-white"
        >
          <AddListSubmitButton language={language} listNumber={listNumber}>
            Start learning this list
          </AddListSubmitButton>
        </form>
      )}
    </>
  );
}
