"use client";

import { submitItemCreateOrEdit } from "@/lib/actions";
import paths from "@/lib/paths";
import {
  Item,
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  ListAndUnitData,
  SupportedLanguage,
  UserLanguagesWithFlags,
} from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import { Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Types } from "mongoose";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegSave } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import BottomRightButton from "../BottomRightButton";
import Spinner from "../Spinner";
import ComboBoxWrapper from "./ComboBoxWrapper";
import EditOrCreatePageContainer from "./EditOrCreatePageContainer";
import LanguagePicker from "./EditOrCreatePageLanguagePicker";
import EnterMultiple from "./EnterMultiple";
import ManageTranslations from "./ManageTranslations";
import PickMultiple from "./PickMultiple";

interface EditOrCreateItemProps {
  userLanguagesWithFlags: UserLanguagesWithFlags;
  item?: ItemWithPopulatedTranslations;
  languageFeaturesForUserLanguages: LanguageFeatures[];
  addToThisList?: ListAndUnitData;
}

export default function EditOrCreateItem({
  userLanguagesWithFlags,
  addToThisList,
  item = {
    name: "",
    normalizedName: "",
    _id: new Types.ObjectId(),
    language:
      addToThisList?.languageWithFlag.name ||
      userLanguagesWithFlags.isLearning[0].name,
    partOfSpeech: "noun",
    slug: "new-item",
    translations: {},
  },
  languageFeaturesForUserLanguages,
}: EditOrCreateItemProps) {
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

  const {
    partsOfSpeech,
    hasGender,
    hasCases,
    tags: langTags,
    ipa,
  } = languageFeaturesForUserLanguages.find(
    (lang) => lang.langCode === itemLanguage
  )!;

  const {
    control,
    handleSubmit,
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
    },
  });

  const onSubmit = async (data: ItemWithPopulatedTranslations) => {
    toast.promise(submitItemCreateOrEdit(data, slug, addToThisList), {
      loading: "Updating...",
      success: () => "Item updated! 🎉",
      error: (err) => err.toString(),
    });
  };

  return (
    <EditOrCreatePageContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-x-4 gap-y-2"
      >
        <div className="flex w-full justify-stretch gap-x-2">
          {slug !== "new-item" && (
            <div>
              <Link
                href={paths.dictionaryItemPath(slug)}
                className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-black"
              >
                <IoArrowBack className="h-8 w-8 rounded-md" />
              </Link>
            </div>
          )}
          <div className="flex h-12 flex-1 items-center justify-center rounded-md bg-red-400 uppercase">
            {mode} mode
          </div>
          <button
            className="hidden w-0 items-center justify-center rounded-md bg-green-400 px-3 hover:bg-green-500 disabled:bg-gray-300 disabled:hover:bg-gray-300 sm:flex sm:h-full sm:w-40 sm:px-6"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting ? (
              <Spinner size="mini" />
            ) : (
              <span className="hidden sm:block">Save Changes</span>
            )}
          </button>
          <BottomRightButton
            styles="sm:hidden"
            disabled={isSubmitting || !isDirty || !isValid}
            icon={
              isSubmitting ? (
                <Spinner size="mini" />
              ) : (
                <FaRegSave className="h-8 w-8 text-white" />
              )
            }
          ></BottomRightButton>
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
        {errors.name && (
          <p className="text-sm text-red-500">{`${errors.name.message}`}</p>
        )}

        <LanguagePicker
          userLanguagesWithFlags={userLanguagesWithFlags}
          setValue={setValue}
          itemLanguage={itemLanguage}
          isNewItem={item.slug === "new-item"}
          setItemLanguage={setItemLanguage}
          errors={errors && errors?.language}
          staticFlag={addToThisList?.languageWithFlag.flag}
        />

        <div className="ml-4 flex flex-col justify-center gap-3">
          <PickMultiple
            setValue={setValue}
            formField="tags"
            initialValue={watch().tags}
            label={{ singular: "Tag", plural: "Tags" }}
            errors={errors && errors?.tags}
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
                    onBlur={onBlur}
                    options={hasGender}
                    errors={errors && errors?.gender}
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
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  options={partsOfSpeech}
                  errors={errors && errors?.partOfSpeech}
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
                    onChange={onChange}
                    onBlur={onBlur}
                    options={hasCases}
                    errors={errors && errors?.case}
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
              errors={errors && errors?.pluralForm}
              mode="strings"
            />
          )}
          <EnterMultiple
            setValue={setValue}
            formField="IPA"
            initialValue={watch().IPA}
            label={{ singular: "IPA", plural: "IPA" }}
            errors={errors && errors?.IPA}
            mode="IPA"
            IPA={ipa}
          />
          <EnterMultiple
            setValue={setValue}
            formField="definition"
            initialValue={watch().definition}
            label={{ singular: "Definition", plural: "Definitions" }}
            errors={errors && errors?.definition}
            mode="longstrings"
          />
          <ManageTranslations
            item={item}
            itemLanguage={watch().language}
            setValue={setValue}
            errors={errors && errors?.translations}
            allTranslations={watch().translations}
            visibleTranslations={getTranslationsForUserLanguages()}
            userLanguagesWithFlags={userLanguagesWithFlags}
          />
        </div>
        {/* Below div is there just so that the bottom right button does not obstruct elements at the bottom on mobile: */}
        <div className="h-20 sm:hidden"></div>
      </form>
    </EditOrCreatePageContainer>
  );

  function getTranslationsForUserLanguages() {
    const translations: Partial<Record<SupportedLanguage, Item[]>> =
      watch().translations;
    const userLanguages = userLanguagesWithFlags.isLearning
      .concat(userLanguagesWithFlags.native)
      .map((lang) => lang.name);

    const copyOfTranslations: Partial<Record<SupportedLanguage, Item[]>> =
      JSON.parse(JSON.stringify(translations));

    Object.keys(copyOfTranslations).forEach((lang) => {
      if (!userLanguages.includes(lang as SupportedLanguage))
        delete copyOfTranslations[lang as SupportedLanguage];
    });
    return copyOfTranslations;
  }
}
