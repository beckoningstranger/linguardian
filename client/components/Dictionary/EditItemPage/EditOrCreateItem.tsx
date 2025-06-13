"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GiSaveArrow } from "react-icons/gi";

import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import Spinner from "@/components/Spinner";
import Button from "@/components/ui/Button";
import { submitItemCreateOrEdit } from "@/lib/actions";
import { setErrorsFromBackend } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import { siteSettings } from "@/lib/siteSettings";
import {
  Item,
  ItemWithPopulatedTranslations,
  ListAndUnitData,
  SeperatedUserLanguages,
  SupportedLanguage,
} from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import EditItemName from "./EditItemName";
import LanguagePicker from "./EditOrCreatePageLanguagePicker";
import EditPartOfSpeechGenderAndCase from "./EditPartOfSpeechGenderAndCase";
import EnterContextItems from "./EnterContextItems";
import EnterDefinition from "./EnterDefinition";
import EnterMultipleStrings from "./EnterMultipleStrings";
import EnterIPA from "./IPA/EnterIPA";
import ManageTranslations from "./ManageTranslations";
import PickMultiple from "./PickMultiple";

interface EditOrCreateItemProps {
  seperatedUserLanguages: SeperatedUserLanguages;
  item?: Omit<ItemWithPopulatedTranslations, "_id">;
  addToThisList?: ListAndUnitData;
  comingFrom?: string;
}

export default function EditOrCreateItem({
  seperatedUserLanguages,
  addToThisList,
  comingFrom,
  item = {
    name: "",
    normalizedName: "",
    language:
      addToThisList?.languageWithFlagAndName.code ||
      seperatedUserLanguages.learnedLanguages[0].code,
    partOfSpeech: "noun",
    slug: "new-item",
    translations: {},
    context: [],
    flagCode:
      addToThisList?.languageWithFlagAndName.flag ||
      seperatedUserLanguages.learnedLanguages[0].flag,
    languageName:
      addToThisList?.languageWithFlagAndName.name ||
      seperatedUserLanguages.learnedLanguages[0].name,
  },
}: EditOrCreateItemProps) {
  const allUserLanguages = [
    seperatedUserLanguages.native,
    ...seperatedUserLanguages.learnedLanguages,
  ];
  const initialName = useSearchParams().get("initialName");
  if (item.name === "" && initialName) item.name = initialName;
  const {
    case: Case,
    context,
    definition,
    gender,
    IPA,
    language,
    name: itemName,
    normalizedName,
    partOfSpeech,
    pluralForm,
    slug,
    tags,
    translations,
  } = item;
  const isNewItem = slug === "new-item";

  const [itemLanguage, setItemLanguage] = useState(language);

  const {
    langName,
    flagCode,
    tags: langTags,
    ipa,
  } = siteSettings.languageFeatures.find(
    (lang) => lang.langCode === itemLanguage
  )!;

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isDirty, isSubmitting, isValid },
    watch,
  } = useForm<ItemWithPopulatedTranslations>({
    resolver: zodResolver(itemSchemaWithPopulatedTranslations),
    defaultValues: {
      case: Case,
      context,
      definition,
      flagCode: "",
      gender,
      IPA,
      language: itemLanguage,
      languageName: "",
      name: itemName,
      normalizedName,
      partOfSpeech,
      pluralForm,
      slug,
      tags,
      translations,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ItemWithPopulatedTranslations) => {
    data.languageName = langName;
    data.flagCode = flagCode;

    toast.promise(submitItemCreateOrEdit(data, slug, addToThisList), {
      loading: "Updating...",
      success: (result) => {
        if (result && result.errors) {
          setErrorsFromBackend(result.errors, setError);
          throw new Error("The server could not validate this data");
        }
        return "Item updated! 🎉";
      },
      error: (err) => err.toString(),
    });
  };

  return (
    <form
      id="EditOrCreateItem"
      onSubmit={handleSubmit(onSubmit)}
      className="flex grow"
    >
      <IconSidebar position="left" showOn="tablet">
        {!isNewItem && (
          <IconSidebarButton
            mode="back"
            label="Back to item overview"
            link={
              comingFrom
                ? `${paths.dictionaryItemPath(slug)}?comingFrom=${comingFrom}`
                : paths.dictionaryItemPath(slug)
            }
          />
        )}
        <IconSidebarButton
          mode="save"
          label="Save your changes"
          disabled={isSubmitting || !isDirty || !isValid}
          type="submit"
        />
      </IconSidebar>
      <div
        id="EditOrCreateItemMain"
        className="grid w-full gap-3 overflow-y-auto bg-white/90 px-4 py-6"
      >
        <EditItemName
          itemName={itemName}
          errors={errors}
          control={control}
          isNewItem={isNewItem}
        />

        <LanguagePicker
          userLanguages={allUserLanguages}
          setValue={setValue}
          itemLanguage={itemLanguage}
          isNewItem={item.slug === "new-item"}
          setItemLanguage={setItemLanguage}
          errors={errors}
          staticFlag={addToThisList?.languageWithFlagAndName.flag}
        />

        <PickMultiple
          setValue={setValue}
          formField="tags"
          initialValue={watch().tags}
          label={{ singular: "Tag", plural: "Tags" }}
          errors={errors}
          options={langTags.forAll
            .concat(langTags[watch().partOfSpeech])
            .filter((item) => item !== undefined)}
        />
        <EditPartOfSpeechGenderAndCase
          watch={watch}
          control={control}
          errors={errors}
          itemLanguage={itemLanguage}
        />
        {watch().partOfSpeech === "noun" && (
          <EnterMultipleStrings
            setValue={setValue}
            formField="pluralForm"
            initialValue={watch().pluralForm}
            label={{ singular: "Plural Form", plural: "Plural Forms" }}
            errors={errors}
          />
        )}
        <EnterIPA
          setValue={setValue}
          initialValue={watch().IPA}
          label={{ singular: "IPA", plural: "IPA" }}
          errors={errors}
          IPA={ipa}
        />
        <EnterDefinition
          setValue={setValue}
          initialValue={watch().definition}
          errors={errors}
        />
        <EnterContextItems
          setValue={setValue}
          initialValue={watch().context}
          errors={errors}
        />
        <ManageTranslations
          item={item}
          itemLanguage={watch().language}
          setValue={setValue}
          errors={errors}
          allTranslations={watch().translations}
          visibleTranslations={getTranslationsForUserLanguages()}
          seperatedUserLanguages={seperatedUserLanguages}
        />
        <Button
          intent="bottomRightButton"
          className="z-10 tablet:hidden"
          disabled={isSubmitting || !isDirty || !isValid}
          aria-label="Save your changes"
          type="submit"
        >
          {isSubmitting ? (
            <Spinner size="mini" />
          ) : (
            <GiSaveArrow className="h-8 w-8" />
          )}
        </Button>
      </div>
    </form>
  );

  function getTranslationsForUserLanguages() {
    const translations: Partial<Record<SupportedLanguage, Item[]>> =
      watch().translations;
    const userLanguageCodes = allUserLanguages.map((lang) => lang.code);

    const copyOfTranslations: Partial<Record<SupportedLanguage, Item[]>> =
      JSON.parse(JSON.stringify(translations));

    Object.keys(copyOfTranslations).forEach((lang) => {
      if (!userLanguageCodes.includes(lang as SupportedLanguage))
        delete copyOfTranslations[lang as SupportedLanguage];
    });
    return copyOfTranslations;
  }
}
