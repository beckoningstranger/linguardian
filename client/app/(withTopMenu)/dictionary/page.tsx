import { getSupportedLanguages } from "@/app/actions";
import Link from "next/link";

export default async function DictionariesPage() {
  const supportedLanguages = (await getSupportedLanguages()) as string[];

  const dictionaryLinks = supportedLanguages.map((lang) => (
    <div key={lang} className="ml-12">
      <Link href={`/dictionary/${lang}`}>{lang}</Link>
    </div>
  ));

  return (
    <>
      <div>There are multiple dictionaries, pick one</div>
      {dictionaryLinks}
    </>
  );
}
