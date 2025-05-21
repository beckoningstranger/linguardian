"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { GiSaveArrow } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";

import { submitItemCreateOrEdit } from "@/lib/actions";
import { setErrorsFromBackend } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import {
  Item,
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  ListAndUnitData,
  SeperatedUserLanguages,
  SupportedLanguage,
} from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import Spinner from "../Spinner";
import Button from "../ui/Button";
import ComboBoxWrapper from "./ComboBoxWrapper";
import EditOrCreatePageContainer from "./EditOrCreatePageContainer";
import LanguagePicker from "./EditOrCreatePageLanguagePicker";
import EnterMultiple from "./EnterMultiple";
import { FormErrors } from "./FormErrors";
import ManageTranslations from "./ManageTranslations";
import PickMultiple from "./PickMultiple";

interface EditOrCreateItemProps {
  seperatedUserLanguages: SeperatedUserLanguages;
  item?: Omit<ItemWithPopulatedTranslations, "_id">;
  allLanguageFeatures: LanguageFeatures[];
  addToThisList?: ListAndUnitData;
}

export default function EditOrCreateItem({
  seperatedUserLanguages,
  addToThisList,
  item = {
    name: "",
    normalizedName: "",
    language:
      addToThisList?.languageWithFlagAndName.code ||
      seperatedUserLanguages.learnedLanguages[0].code,

    partOfSpeech: "noun",
    slug: "new-item",
    translations: {},
    flagCode:
      addToThisList?.languageWithFlagAndName.flag ||
      seperatedUserLanguages.learnedLanguages[0].flag,
    languageName:
      addToThisList?.languageWithFlagAndName.name ||
      seperatedUserLanguages.learnedLanguages[0].name,
  },
  allLanguageFeatures,
}: EditOrCreateItemProps) {
  const allUserLanguages = [
    seperatedUserLanguages.native,
    ...seperatedUserLanguages.learnedLanguages,
  ];
  const initialName = useSearchParams().get("initialName");
  if (item.name === "" && initialName) item.name = initialName;
  const {
    name: itemName,
    partOfSpeech,
    language,
    normalizedName,
    definition,
    gender,
    pluralForm,
    translations,
    case: Case,
    IPA,
    slug,
    tags,
  } = item;

  const mode = item.slug !== "new-item" ? "Edit" : "Create";

  const [itemLanguage, setItemLanguage] = useState(language);

  const featuresForItemLanguage = allLanguageFeatures.find(
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
      name: itemName,
      gender,
      partOfSpeech,
      slug,
      language: itemLanguage,
      case: Case,
      pluralForm,
      IPA,
      normalizedName,
      definition,
      tags,
      translations,
      languageName: "",
      flagCode: "",
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

  console.log("submitting", isSubmitting, "dirty?", isDirty, "valid", isValid);

  console.log("errors", Object.keys(errors).length, errors);

  return (
    <EditOrCreatePageContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-20 flex flex-col gap-x-4 gap-y-2"
      >
        <div className="flex w-full justify-stretch gap-x-2">
          {slug !== "new-item" && (
            <Button
              intent="icon"
              className="h-12 w-12 border-2 border-black text-slate-800"
            >
              <Link href={paths.dictionaryItemPath(slug)}>
                <IoArrowBack className="h-8 w-8" />
              </Link>
            </Button>
          )}
          <div className="flex h-12 flex-1 items-center justify-center rounded-md bg-red-400 uppercase">
            {mode} mode
          </div>
          <Button
            intent="primary"
            className="hidden place-items-center sm:grid"
            disabled={isSubmitting || !isDirty || !isValid}
            type="submit"
          >
            {isSubmitting ? (
              <Spinner size="mini" />
            ) : (
              <span className="hidden sm:block">Save Changes</span>
            )}
          </Button>
          <Button
            intent="bottomRightButton"
            className="sm:hidden"
            disabled={isSubmitting || !isDirty || !isValid}
            aria-label="Save your changes"
          >
            {isSubmitting ? (
              <Spinner size="mini" />
            ) : (
              <GiSaveArrow className="h-8 w-8" />
            )}
          </Button>
        </div>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              defaultValue={itemName}
              placeholder="Item name"
              className="text-3xl font-bold focus:px-2"
              autoFocus
            />
          )}
        />
        <FormErrors field="name" errors={errors} />

        <LanguagePicker
          userLanguages={allUserLanguages}
          setValue={setValue}
          itemLanguage={itemLanguage}
          isNewItem={item.slug === "new-item"}
          setItemLanguage={setItemLanguage}
          errors={errors}
          staticFlag={addToThisList?.languageWithFlagAndName.flag}
        />

        <div className="ml-4 flex flex-col justify-center gap-3">
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
          <div className="flex flex-col gap-2 bg-white sm:flex-row">
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
            <EnterMultiple
              setValue={setValue}
              formField="pluralForm"
              initialValue={watch().pluralForm}
              label={{ singular: "Plural Form", plural: "Plural Forms" }}
              errors={errors}
              mode="strings"
            />
          )}
          <EnterMultiple
            setValue={setValue}
            formField="IPA"
            initialValue={watch().IPA}
            label={{ singular: "IPA", plural: "IPA" }}
            errors={errors}
            mode="IPA"
            IPA={ipa}
          />
          <EnterMultiple
            setValue={setValue}
            formField="definition"
            initialValue={watch().definition}
            label={{ singular: "Definition", plural: "Definitions" }}
            errors={errors}
            mode="longstrings"
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
      </form>
    </EditOrCreatePageContainer>
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
