import Link from "next/link";

import ItemPageDEFTRCO from "@/components/Dictionary/ItemPage/ItemPageDEF-TR-CO";
import ItemPageMain from "@/components/Dictionary/ItemPage/ItemPageMain";
import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import Button from "@/components/ui/Button";
import { getPopulatedItemBySlug } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SlugLanguageObject } from "@/lib/types";

export const metadata = { title: "Dictionary" };

// export async function generateStaticParams() {
//   const supportedLanguages = await getSupportedLanguages();
//   let allSlugs: { slug: string }[] = [];
//   const promises = supportedLanguages?.map((lang: SupportedLanguage) =>
//     getAllSlugsForLanguage(lang)
//   );
//
//   if (promises) {
//     const resolvedPromises = await Promise.all(promises);
//     if (resolvedPromises)
//       resolvedPromises.forEach((language) =>
//         language?.forEach((item) => {
//           allSlugs.push(item);
//         })
//       );

//     return allSlugs;
//   } else {
//     return [];
//   }
// }

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
      <div className="top-[112px] w-full bg-white/80 pb-8 text-center text-cxlr">
        <p>No item found</p>
        <Link href={paths.dictionaryPath()}>
          <Button intent="primary" className="mt-4 p-4" rounded>
            Back to dictionary
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="flex tablet:pl-2">
      <div className="py-2">
        <IconSidebar position="left" showOn="tablet">
          <IconSidebarButton
            type="back"
            label={comingFrom ? "Back to list" : "Back to dictionary"}
            link={comingFrom || paths.dictionaryPath()}
          />
          <IconSidebarButton
            type="edit"
            label="Edit this item"
            link={paths.editDictionaryItemPath(slug)}
          />
        </IconSidebar>
      </div>
      <div className="min-h-[calc(100vh-112px)] w-full bg-white/80 px-4 pt-2 tablet:ml-2 tablet:pl-8">
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
      </div>
    </div>
  );
}
