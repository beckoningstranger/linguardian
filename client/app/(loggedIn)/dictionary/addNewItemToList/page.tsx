import EditOrCreateItem from "@/components/Dictionary/EditItemPage/EditOrCreateItem";
import {
  ItemWithPopulatedTranslations,
  LanguageFeatures,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { allLanguageFeatures } from "@/lib/siteSettings";
import { getUserOnServer } from "@/lib/utils";
import {
  parseLanguageCode,
  parseListNumber,
  parseUnitNumber,
} from "@/lib/utils/pages";

interface NewItemPageProps {
  searchParams: Promise<{
    initialName: string;
    addToList: string;
    addToUnit: string;
    unitName: string;
    listLanguage: string;
  }>;
}

export default async function NewItemPage(props: NewItemPageProps) {
  const searchParams = await props.searchParams;

  const {
    initialName,
    addToList,
    addToUnit,
    listLanguage,
    unitName
  } = searchParams;

  const listNumber = parseListNumber(addToList);
  const unitNumber = parseUnitNumber(addToUnit);
  const langCode = parseLanguageCode(listLanguage);

  const user = await getUserOnServer();
  if (!user) throw new Error("Could not get user");

  const addToUnitInfo:
    | { listNumber: number; unitName: string; unitNumber: number }
    | undefined = { listNumber, unitName, unitNumber };

  const itemLanguageFeatures: LanguageFeatures | undefined =
    allLanguageFeatures.find((lang) => lang.langCode === langCode);

  const comingFrom = paths.editUnitPath(listNumber, unitNumber);

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
