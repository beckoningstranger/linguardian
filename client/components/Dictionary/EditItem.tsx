"use client";

import { submitItemEdit } from "@/lib/actions";
import paths from "@/lib/paths";
import {
  ItemWithPopulatedTranslations,
  LanguageFeatures,
  LanguageWithFlag,
} from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import { Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import Spinner from "../Spinner";
import ComboBoxWrapper from "./ComboBoxWrapper";
import EnterMultiple from "./EnterMultiple";
import ItemPageContainer from "./ItemPageContainer";
import ManageTranslations from "./ManageTranslations";
import PickMultiple from "./PickMultiple";

interface EditItemProps {
  item: ItemWithPopulatedTranslations;
  languageFeatures: LanguageFeatures;
  userLanguagesWithFlags: {
    native: LanguageWithFlag;
    isLearning: LanguageWithFlag[];
  };
}

export default function EditItem({ item, languageFeatures }: EditItemProps) {
  const { partsOfSpeech, hasGender, hasCases } = languageFeatures;
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
      language,
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
    toast.promise(submitItemEdit(slug, data), {
      loading: "Updating...",
      success: () => "Item updated! 🎉",
      error: (err) => err.toString(),
    });
  };

  return (
    <ItemPageContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-x-4 gap-y-2"
      >
        <div className="flex w-full items-center justify-stretch gap-x-2">
          <div>
            <Link
              href={paths.dictionaryItemPath(language, slug)}
              className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black"
            >
              <IoArrowBack className="h-7 w-7 rounded-md" />
            </Link>
          </div>
          <div className="flex h-full flex-1 items-center justify-center rounded-md bg-red-400 uppercase">
            Edit mode
          </div>
          <button
            className="flex h-full w-40 items-center justify-center rounded-md bg-green-400 px-3 hover:bg-green-500 disabled:bg-gray-300 disabled:hover:bg-gray-300 sm:px-6"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting ? <Spinner size="mini" /> : <span>Save Changes</span>}
          </button>
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
              className="text-xl font-bold focus:px-2"
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{`${errors.name.message}`}</p>
        )}
        <div className="ml-4 flex flex-col justify-center gap-3">
          <PickMultiple
            setValue={setValue}
            formField="tags"
            initialValue={watch().tags}
            label={{ singular: "Tag", plural: "Tags" }}
            errors={errors && errors?.tags}
            options={languageFeatures.tags.forAll
              .concat(languageFeatures.tags[watch().partOfSpeech])
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
            IPA={languageFeatures.ipa}
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
            setValue={setValue}
            initialValue={watch().translations["FR"]?.map((item) => item._id)}
            errors={errors && errors?.translations}
          />
        </div>
      </form>
    </ItemPageContainer>
  );
}
