import { getAllLanguageFeatures, getSupportedLanguages } from "@/app/actions";
import NativeLanguageForm from "@/components/NativeLanguageForm";

export default async function Onboarding() {
  const supportedLanguage = await getSupportedLanguages();
  const allLanguageFeatures = await getAllLanguageFeatures();
  if (!supportedLanguage || !allLanguageFeatures)
    throw new Error("Failed to get site settings");

  return (
    <div className="grid place-items-center">
      <h1 className="mt-6 text-2xl font-semibold">
        What's your native language?
      </h1>
      <NativeLanguageForm
        supportedLanguages={supportedLanguage}
        allLanguageFeatures={allLanguageFeatures}
      />
    </div>
  );
}
