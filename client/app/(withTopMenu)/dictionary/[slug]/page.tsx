import Link from "next/link";

import ItemDetails from "@/components/Dictionary/ItemPage/ItemDetails";
import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import Button from "@/components/ui/Button";
import { getPopulatedItemBySlug } from "@/lib/fetchData";
import { getAllUserLanguages } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { SlugLanguageObject } from "@/lib/types";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import TopContextMenuLoader from "@/components/Menus/TopMenu/TopContextMenuLoader";

export const metadata = { title: "Dictionary" };

// export async function generateStaticParams() {
//   let allSlugs: { slug: string }[] = [];
//   const promises = siteSettings.supportedLanguages.map((lang: SupportedLanguage) =>
//     getAllSlugsForLanguage(lang)
//   );

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
    <div className="flex">
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
      {/* <div className="min-h-[calc(100vh-112px)] w-full bg-white/80 px-4 pt-2 tablet:ml-2 tablet:pl-8"> */}
      <ItemDetails item={item} />
      {/* </div> */}
      <MobileMenuContextProvider>
        <TopContextMenuLoader itemSlug={item.slug} opacity={90} />
      </MobileMenuContextProvider>
    </div>
  );
}
