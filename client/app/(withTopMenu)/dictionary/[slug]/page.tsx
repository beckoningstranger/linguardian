import Link from "next/link";

import ItemDetails from "@/components/Dictionary/ItemPage/ItemDetails";
import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";
import Button from "@/components/ui/Button";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { getPopulatedItemBySlug } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SlugLanguageObject } from "@/lib/types";

export const metadata = {
  title: "Dictionary",
  description: "Look up words for all the languages you learn and know",
};

// export async function generateStaticParams() {
//   // If this is to work, we have to get data from the API during getDataToBuild and then read it from there, not through fetchData,
//   // because the frontend can't query the backend during build afaik, it's in a different container
//   let allSlugs: { slug: string }[] = [];
//   const allSlugsForAllLanguagesPromises = siteSettings.supportedLanguages.map(
//     (lang) => getAllSlugsForLanguage(lang)
//   );

//   if (allSlugsForAllLanguagesPromises) {
//     const allSlugsForAllLanguages = await Promise.all(
//       allSlugsForAllLanguagesPromises
//     );
//     if (allSlugsForAllLanguages)
//       allSlugsForAllLanguages.forEach((language) =>
//         language?.forEach((slug) => {
//           allSlugs.push(slug);
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
    <div className="flex">
      <IconSidebar position="left" showOn="tablet">
        <IconSidebarButton
          mode="back"
          label={comingFrom ? "Back to list" : "Back to dictionary"}
          link={comingFrom || paths.dictionaryPath()}
        />
        <IconSidebarButton
          mode="edit"
          label="Edit this item"
          link={paths.editDictionaryItemPath(slug)}
        />
      </IconSidebar>
      <ItemDetails item={item} />
      <MobileMenuContextProvider>
        <TopContextMenuLoader itemSlug={item.slug} opacity={90} />
      </MobileMenuContextProvider>
    </div>
  );
}
