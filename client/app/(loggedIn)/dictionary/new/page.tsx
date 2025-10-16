import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import {
  ItemWithPopulatedTranslations,
  LanguageFeatures,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { allLanguageFeatures } from "@/lib/siteSettings";
import { getUserOnServer, isSupportedLanguage } from "@/lib/utils";

interface NewItemPageProps {
  searchParams: {
    initialName: string;
    addToList: string;
    addToUnit: string;
    unitName: string;
    language: string;
  };
}

export default async function NewItemPage({
  searchParams: { initialName, addToList, addToUnit, language, unitName },
}: NewItemPageProps) {
  const listNumber = parseInt(addToList);
  const unitNumber = parseInt(addToUnit);

  const user = await getUserOnServer();
  if (!user) throw new Error("Could not get user");

  let addToUnitInfo:
    | { listNumber: number; unitName: string; unitNumber: number }
    | undefined;
  let itemLanguageFeatures: LanguageFeatures | undefined;
  if (!isNaN(listNumber) || !isNaN(unitNumber)) {
    addToUnitInfo = { listNumber, unitName, unitNumber };
  }
  if (isSupportedLanguage(language)) {
    const foundFeatures = allLanguageFeatures.find(
      (lang) => lang.langCode === language
    );

    itemLanguageFeatures = foundFeatures;
  }

  const comingFrom =
    listNumber && unitNumber
      ? paths.editUnitPath(listNumber, unitNumber)
      : undefined;

  const item: ItemWithPopulatedTranslations = {
    id: "newItem",
    name: initialName || "Change me",
    normalizedName: "",
    language: itemLanguageFeatures?.langCode
      ? itemLanguageFeatures.langCode
      : user.native.code,
    partOfSpeech: "noun",
    slug: "",
    translations: {},
    context: [],
    flagCode: itemLanguageFeatures?.flagCode
      ? itemLanguageFeatures.flagCode
      : user.native.flag,
    languageName: itemLanguageFeatures?.langName
      ? itemLanguageFeatures.langName
      : user.native.name,
  };

  return (
    <EditOrCreateItem
      comingFrom={comingFrom}
      item={item}
      addToUnit={addToUnitInfo}
    />
  );
}
