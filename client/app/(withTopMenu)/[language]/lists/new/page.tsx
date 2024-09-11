import ParseCSVForm from "@/components/parseCSVForm";
import { getLanguageFeaturesForLanguage } from "@/lib/fetchData";
import getUserOnServer from "@/lib/helperFunctions";
import { SupportedLanguage } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload a new list",
};

interface CreateListProps {
  params: { language: SupportedLanguage };
}

export default async function CreateList({
  params: { language },
}: CreateListProps) {
  const sessionUser = await getUserOnServer();
  const languageFeaturesForLanguage = await getLanguageFeaturesForLanguage(
    language
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="m-4 max-w-80 text-center text-2xl font-bold">
        Upload a File to create a new {languageFeaturesForLanguage?.langName}{" "}
        list
      </h1>
      <ParseCSVForm userId={sessionUser.id} listLanguage={language} />
    </div>
  );
}
