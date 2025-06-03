"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GiSaveArrow } from "react-icons/gi";

import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import Spinner from "@/components/Spinner";
import Button from "@/components/ui/Button";
import StyledInput from "@/components/ui/StyledInput";
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
import { FormErrors } from "../../ui/FormErrors";
import ComboBoxWrapper from "./ComboBoxWrapper";
import LanguagePicker from "./EditOrCreatePageLanguagePicker";
import EnterContextItems from "./EnterContextItems";
import EnterDefinition from "./EnterDefinition";
import EnterMultipleStrings from "./EnterMultipleStrings";
import ManageTranslations from "./ManageTranslations";
import PickMultiple from "./PickMultiple";
import EnterIPA from "./IPA/EnterIPA";

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

  const featuresForItemLanguage = siteSettings.languageFeatures.find(
    (lang) => lang.langCode === itemLanguage
  );
  if (!featuresForItemLanguage)
    throw new Error("Item language features not found");

  const {
    partsOfSpeech,
    hasGender,
    hasCases,
    tags: langTags,
    ipa,
  } = featuresForItemLanguage;
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
    data.languageName = featuresForItemLanguage.langName;
    data.flagCode = featuresForItemLanguage.flagCode;

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
      onSubmit={handleSubmit(onSubmit)}
      className="mb-20 flex min-h-[calc(100vh-112px)]"
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
      <div className="w-full bg-white/90 px-4 py-6">
        <Button
          intent="bottomRightButton"
          className="tablet:hidden"
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
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <div className="grid gap-2">
              <StyledInput
                label="Item name"
                onChange={onChange}
                onBlur={onBlur}
                id="name"
                defaultValue={itemName}
                placeholder="Item name"
                autoFocus={isNewItem}
                hasErrors={!!errors["name"]}
              />
              <FormErrors field="name" errors={errors} />
            </div>
          )}
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

        <div className="flex flex-col justify-center gap-3">
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
          <div className="text-sm font-semibold">Part of Speech</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {watch().partOfSpeech === "noun" && hasGender.length > 0 && (
              <Controller
                name="gender"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <ComboBoxWrapper
                    placeholder="Noun gender"
                    value={value ? value : ""}
                    onChange={onChange}
                    formField="gender"
                    onBlur={onBlur}
                    options={hasGender}
                    errors={errors}
                  />
                )}
              />
            )}
            <Controller
              name="partOfSpeech"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <ComboBoxWrapper
                  placeholder="Part of Speech"
                  formField="partOfSpeech"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  options={partsOfSpeech}
                  errors={errors}
                />
              )}
            />
            {watch().partOfSpeech === "preposition" && hasCases.length > 0 && (
              <Controller
                name="case"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <ComboBoxWrapper
                    placeholder="Case after preposition"
                    value={value ? value : ""}
                    formField="case"
                    onChange={onChange}
                    onBlur={onBlur}
                    options={hasCases}
                    errors={errors}
                  />
                )}
              />
            )}
          </div>
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
        </div>
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
