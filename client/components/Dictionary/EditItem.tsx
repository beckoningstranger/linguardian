"use client";

import { submitItemEdit } from "@/lib/actions";
import paths from "@/lib/paths";
import { ItemWithPopulatedTranslations } from "@/lib/types";
import { itemSchemaWithPopulatedTranslations } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import ItemPageContainer from "./ItemPageContainer";

interface EditItemProps {
  item: ItemWithPopulatedTranslations;
}

export default function EditItem({ item }: EditItemProps) {
  const {
    name: itemName,
    partOfSpeech,
    language,
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
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ItemWithPopulatedTranslations>({
    resolver: zodResolver(itemSchemaWithPopulatedTranslations),
    defaultValues: {
      name: itemName,
      gender,
      partOfSpeech,
      slug,
      language,
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
        className="flex flex-col gap-x-4 gap-y-1"
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
            className="flex h-full items-center justify-center rounded-md bg-green-400 px-6 hover:bg-green-500 disabled:bg-gray-300 disabled:hover:bg-gray-300"
            disabled={isSubmitting || !isDirty}
          >
            Save Changes
          </button>
        </div>
        <input
          {...register("name")}
          defaultValue={itemName}
          placeholder="Item name"
          className="text-xl font-bold focus:px-2"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{`${errors.name.message}`}</p>
        )}
        <div className="ml-4">
          <div className="flex">
            {partOfSpeech === "noun" && (
              <>
                <input
                  {...register("gender", {
                    // validate: (value) =>
                    //   ["masculine", "feminine"].includes(getValues("gender")) ||
                    //   "Must be masculine or feminine",
                  })}
                  placeholder="noun gender"
                  defaultValue={gender}
                  className="mr-2 w-24"
                />
                {errors.gender && (
                  <p className="max-w-fit text-sm text-red-500">{`${errors.gender.message}`}</p>
                )}
              </>
            )}
            <div>
              <input
                {...register("partOfSpeech")}
                placeholder="Part of Speech"
                defaultValue={partOfSpeech}
                className="inline"
              />
              {errors.partOfSpeech && (
                <p className="text-sm text-red-500">{`${errors.partOfSpeech.message}`}</p>
              )}
            </div>
          </div>
        </div>
        <input
          type="hidden"
          {...register("language")}
          defaultValue={language}
        />
        <input type="hidden" {...register("slug")} defaultValue={slug} />
      </form>
    </ItemPageContainer>
  );
  {
    /* <ItemPageContainer>
    <div>
    <form className="flex items-center gap-4">
    <h1 className="text-xl font-bold">{itemName}</h1>
    <div>
              {gender && <span>{gender.join("/")}</span>}
              <span> {partOfSpeech}</span>
            </div>
          </form>
          {IPA && IPA.length > 0 && (
            <div className="ml-2">/ {IPA.join(", ")} /</div>
          )}
          {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
            <div className="ml-2 mt-1 text-sm">plural: {pluralForm}</div>
          )}
        </div>
      </ItemPageContainer> */
  }
}
