"use client";
import { createList } from "@/lib/actions";
import { SupportedLanguage } from "@/lib/types";
import { Input, Textarea } from "@headlessui/react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface createNewListFormProps {
  userId: string;
  listLanguage: SupportedLanguage;
}

export default function CreateNewListForm({
  userId,
  listLanguage,
}: createNewListFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    if (data.csvfile && data.csvfile.length > 0) {
      formData.append("csvfile", data.csvfile[0]);
    }

    toast.promise(createList(formData), {
      loading: "Creating a new list, please be patient.",
      success: "List created! 🎉",
      error: (error) => error.toString(),
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-md bg-slate-100 p-2 text-center"
    >
      <label htmlFor="listName" className="sr-only">
        Enter a list name
      </label>
      <Input
        {...register("listName", {
          required: "A list name is required",
          minLength: {
            value: 8,
            message: "Please provide a descriptive list name",
          },
          maxLength: {
            value: 50,
            message: "List names can be no longer than 50 characters",
          },
        })}
        type="text"
        id="listName"
        placeholder="Enter a list name"
        className="px-4 py-2 text-center text-xl font-semibold"
      />
      {errors.listName && (
        <p className="text-sm text-red-500">{`${errors.listName.message}`}</p>
      )}
      <Textarea
        id="listDescription"
        {...register("listDescription", {
          maxLength: {
            value: 500,
            message: "List descriptions can be no longer than 500 characters",
          },
        })}
        placeholder="Enter a short description for your list"
        className="text-md px-4 py-2 font-semibold"
      />
      {errors.listName && (
        <p className="text-sm text-red-500">{`${errors.listName.message}`}</p>
      )}
      <label
        htmlFor="csvfile"
        className="cursor-pointer rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        <Input
          {...register("csvfile")}
          type="file"
          name="csvfile"
          id="csvfile"
          accept=".csv"
          className="sr-only"
          aria-label="Upload a CSV File"
        />
        {"Upload a CSV file (optional)"}
      </label>
      {errors.csvfile && (
        <p className="text-sm text-red-500">{`${errors.csvfile.message}`}</p>
      )}
      <input type="hidden" {...register("language", { value: listLanguage })} />
      <input type="hidden" {...register("author", { value: userId })} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="m-2 rounded border-2 border-black p-3 transition-all hover:scale-105 hover:border-green-500 hover:bg-green-500 hover:text-white"
      >
        Start upload & Create a new list
      </button>
    </form>
  );
}