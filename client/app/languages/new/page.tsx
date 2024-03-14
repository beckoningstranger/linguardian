import {
  getLanguageFeaturesForLanguage,
  getSupportedLanguages,
  getUserById,
} from "@/app/actions";
import { SupportedLanguage } from "@/types";
import Link from "next/link";
import Flag from "react-world-flags";

export default async function AddNewLanguageToLearn() {
  const supportedLanguages = await getSupportedLanguages();
  const user = await getUserById(1);
  const languagesAlreadyLearned = user?.languages.reduce((a, curr) => {
    a.push(curr.code);
    return a;
  }, [] as SupportedLanguage[]);

  const renderedFlags = supportedLanguages?.map(async (lang) => {
    if (!languagesAlreadyLearned?.includes(lang) && user?.native !== lang) {
      const languageFeatures = await getLanguageFeaturesForLanguage(lang);

      return (
        <div>
          <Link key={lang} href={`/languages/add?lang=${lang}`}>
            <Flag
              code={languageFeatures?.flagCode}
              className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
            />
          </Link>
        </div>
      );
    }
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-20 mx-auto text-2xl font-semibold">
        Pick a new language to study:
      </div>
      <div className="grid grid-cols-2 gap-5">{renderedFlags}</div>
    </div>
  );
}
