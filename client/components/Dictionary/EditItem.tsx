"use client";

import { submitItemEdit } from "@/lib/actions";
import paths from "@/lib/paths";
import { ItemWithPopulatedTranslations, LanguageFeatures } from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import { Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import ComboBoxWrapper from "./ComboBoxWrapper";
import EnterMultiple from "./EnterMultiple";
import ItemPageContainer from "./ItemPageContainer";

interface EditItemProps {
  item: ItemWithPopulatedTranslations;
  languageFeatures: LanguageFeatures;
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
    },
  });

  const onSubmit = async (data: ItemWithPopulatedTranslations) => {
    toast.promise(submitItemEdit(slug, data), {
      loading: "Loading",
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
            className="flex h-full items-center justify-center rounded-md bg-green-400 px-3 hover:bg-green-500 disabled:bg-gray-300 disabled:hover:bg-gray-300 sm:px-6"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            Save Changes
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
                    error={errors.gender}
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
                  error={errors.partOfSpeech}
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
                    error={errors.case}
                  />
                )}
              />
            )}
          </div>
          {watch().partOfSpeech === "noun" && (
            <EnterMultiple
              setFormValue={setValue}
              formField="pluralForm"
              initialValue={watch().pluralForm}
              label={{ singular: "plural form", plural: "plural forms" }}
              errors={errors && errors?.pluralForm}
            />
          )}
          {/* <div className="">IPA</div> */}
        </div>
      </form>
    </ItemPageContainer>
  );
  {
    // <ItemPageContainer>
    //   <div>
    //     <form className="flex items-center gap-4">
    //       <h1 className="text-xl font-bold">{itemName}</h1>
    //       <div>
    //         {gender && <span>{gender.join("/")}</span>}
    //         <span> {partOfSpeech}</span>
    //       </div>
    //     </form>
    //     {IPA && IPA.length > 0 && (
    //       <div className="ml-2">/ {IPA.join(", ")} /</div>
    //     )}
    //     {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
    //       <div className="ml-2 mt-1 text-sm">plural: {pluralForm}</div>
    //     )}
    //   </div>
    // </ItemPageContainer>;
  }
}
