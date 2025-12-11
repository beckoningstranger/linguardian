import { notFound } from "next/navigation";

import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import ItemDetails from "@/components/Dictionary/ItemPage/ItemDetails";
import TopContextMenu from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenu";
import TopContextMenuButton from "@/components/Menus/TopMenu/TopContextMenu/TopContextMenuButton";
import { fetchItemBySlug } from "@/lib/api/item-api";
import { SupportedLanguage } from "@/lib/contracts";
import paths from "@/lib/paths";
import { allSupportedLanguages } from "@/lib/siteSettings";
import { filterItemDataForUserLanguages, getUserOnServer } from "@/lib/utils";

// export async function generateStaticParams() {
// If this is to work, we have to get data from the API at build time

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

export async function generateMetadata({
  params: { itemSlug },
}: ItemPageProps) {
  const response = await fetchItemBySlug({ itemSlug });
  if (!response.success) notFound();

  const item = response.data;
  return {
    title: item.name,
    description: "Look up words for all the languages you learn and know",
  };
}

interface ItemPageProps {
  params: { itemSlug: string };
  searchParams: { comingFrom: string };
}

export default async function ItemPage({
  params: { itemSlug },
  searchParams: { comingFrom },
}: ItemPageProps) {
  const user = await getUserOnServer();
  const response = await fetchItemBySlug({ itemSlug });
  if (!response.success) notFound();

  const item = response.data;

  const allUserLanguageCodes: SupportedLanguage[] = user
    ? [user.native.code, ...user.learnedLanguages.map((lang) => lang.code)]
    : allSupportedLanguages;

  const filteredItem = filterItemDataForUserLanguages(
    item,
    allUserLanguageCodes
  );

  return (
    <div className="flex grow">
      <IconSidebar position="left" showOn="tablet">
        <IconSidebarButton
          mode="back"
          label={comingFrom ? "Back to list" : "Back to dictionary"}
          link={comingFrom || paths.dictionaryPath()}
        />
        <IconSidebarButton
          mode="edit"
          label="Edit this item"
          link={paths.editDictionaryItemPath(itemSlug)}
        />
      </IconSidebar>
      <ItemDetails
        item={filteredItem}
        allUserLanguageCodes={allUserLanguageCodes}
      />
      <TopContextMenu>
        <TopContextMenuButton
          mode="back"
          target="item"
          link={comingFrom || paths.dictionaryPath()}
        />
        <TopContextMenuButton
          mode="edit"
          target="item"
          link={paths.editDictionaryItemPath(itemSlug)}
        />
      </TopContextMenu>
    </div>
  );
}
