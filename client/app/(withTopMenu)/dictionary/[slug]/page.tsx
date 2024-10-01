import ItemPageBottomRightButton from "@/components/Dictionary/ItemPageBottomRightButton";
import ItemPageContainer from "@/components/Dictionary/ItemPageContainer";
import ItemPageDEFTRCO from "@/components/Dictionary/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPageMain";
import ItemBackButton from "@/components/Lists/ItemBackButton";
import {
  getAllSlugsForLanguage,
  getPopulatedItemBySlug,
  getSupportedLanguages,
} from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SlugLanguageObject, SupportedLanguage } from "@/lib/types";
import { Button } from "@headlessui/react";
import Link from "next/link";

export const metadata = { title: "Dictionary" };

export async function generateStaticParams() {
  const supportedLanguages = await getSupportedLanguages();
  let allSlugs: { slug: string }[] = [];
  const promises = supportedLanguages?.map((lang: SupportedLanguage) =>
    getAllSlugsForLanguage(lang)
  );

  if (promises) {
    const resolvedPromises = await Promise.all(promises);
    if (resolvedPromises)
      resolvedPromises.forEach((language) =>
        language?.forEach((item) => {
          allSlugs.push(item);
        })
      );

    return allSlugs;
  } else {
    return [];
  }
}

interface ItemPageProps {
  params: SlugLanguageObject;
  searchParams: { comingFrom: string };
}

export default async function ItemPage({
  params: { slug },
  searchParams: { comingFrom },
}: ItemPageProps) {
  const userLanguages = await getAllUserLanguages();

  const item = await getPopulatedItemBySlug(slug, userLanguages);
  if (!item)
    return (
      <div className="grid h-96 place-items-center">
        <div>
          <div className="text-center">No item found</div>
          <Link href={paths.dictionaryPath()}>
            <Button className={"rounded-md bg-green-400 px-4 py-2"}>
              Back to dictionary
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <ItemPageContainer>
      <ItemBackButton path={comingFrom} />
      <ItemPageMain
        itemName={item.name}
        partOfSpeech={item.partOfSpeech}
        gender={item.gender}
        case={item.case}
        IPA={item.IPA}
        pluralForm={item.pluralForm}
        tags={item.tags}
      />
      <ItemPageDEFTRCO
        definition={item.definition}
        translations={item.translations}
      />
      <ItemPageBottomRightButton
        path={
          paths.editDictionaryItemPath(item.slug) + `?comingFrom=${comingFrom}`
        }
      />
    </ItemPageContainer>
  );
}
