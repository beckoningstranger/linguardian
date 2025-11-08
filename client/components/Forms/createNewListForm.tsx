"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Button,
  ListnameInput,
  Spinner,
  Dropdown,
  SubmitCSVFile,
  CheckboxField,
} from "@/components";
import { useUser } from "@/context/UserContext";

import {
  createNewListFormSchema,
  CreateNewListForm as CreateNewListFormType,
  LanguageWithFlagAndName,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { allListDifficulties } from "@/lib/siteSettings";
import ListDescriptionTextarea from "./ListDescriptionTextarea";
import { createListAction } from "@/lib/actions/list-actions";

interface createNewListFormProps {
  language: LanguageWithFlagAndName;
}

export default function CreateNewListForm({
  language,
}: createNewListFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const methods = useForm<CreateNewListFormType>({
    resolver: zodResolver(createNewListFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      private: false,
      difficulty: "Novice",
      language,
      authors: [user?.id],
    },
  });

  const { isSubmitting, isValid, isDirty } = methods.formState;

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    const { language: listLanguage } = methods.watch();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === "object" && !(value instanceof FileList)) {
        formData.set(key, JSON.stringify(value)); // for objects and arrays
      } else {
        formData.set(key, value); // for strings, numbers, booleans
      }
    });

    if (data.csvfile && data.csvfile.length > 0) {
      formData.set("csvfile", data.csvfile[0]);
    }

    const response = await toast.promise(
      createListAction(formData, listLanguage.code),
      {
        loading: "Creating a new list, please be patient...",
        success: (result) => result.message ?? "List created successfully! 🎉",
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );

    if (response?.listNumber) {
      methods.reset();
      router.push(paths.listDetailsPath(response.listNumber));
    }
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8 rounded-md bg-white/90 p-2 text-center tablet:max-h-fit tablet:max-w-[800px] tablet:p-8"
      >
        <h1 className="bg-white/80 text-center font-serif text-hlg text-blue-800">
          Create a new {language?.name} list
        </h1>
        <ListnameInput label="Enter a list name" formField="name" />
        <div className="flex flex-col gap-2">
          <ListDescriptionTextarea />
          <CheckboxField
            name="private"
            label="This is a private list and should be hidden from other users"
          />
          <Dropdown
            options={allListDifficulties}
            formValue="difficulty"
            label="Select list difficulty"
          />
          <SubmitCSVFile optional={true} />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            intent="primary"
            rounded
            busy={loading}
          >
            {methods.watch("csvfile")?.length > 0
              ? "Start upload & Create a new list"
              : "Create a new list"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
