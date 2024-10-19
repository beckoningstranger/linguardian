import ItemPageContainer from "@/components/Dictionary/ItemPageContainer";
import ItemPageDEFTRCO from "@/components/Dictionary/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPageMain";
import ItemBackButton from "@/components/Lists/ItemBackButton";
import Button from "@/components/ui/Button";
import {
  getAllSlugsForLanguage,
  getPopulatedItemBySlug,
  getSupportedLanguages,
} from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SlugLanguageObject, SupportedLanguage } from "@/lib/types";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

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

  const item = await getPopulatedItemBySlug(
    slug,
    userLanguages.map((lang) => lang.code)
  );
  if (!item)
    return (
      <div className="grid h-[calc(100vh-90px)] place-items-center">
        <div className="grid gap-y-6">
          <div className="text-center text-xl">No item found</div>
          <Link href={paths.dictionaryPath()}>
            <Button intent="primary">Back to dictionary</Button>
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
      <Link
        href={
          paths.editDictionaryItemPath(item.slug) + `?comingFrom=${comingFrom}`
        }
      >
        <Button bottomRightButton intent="icon" aria-label="Edit this item">
          <MdEdit className="h-8 w-8" />
        </Button>
      </Link>
    </ItemPageContainer>
  );
}
