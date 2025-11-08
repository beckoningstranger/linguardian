"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { uploadCSVFileAction } from "@/lib/actions/list-actions";
import {
  ExpandListForm,
  expandListFormSchema,
  SupportedLanguage,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import SubmitCSVFile from "./SubmitCSVFile";

interface ExpandListWithCsvFormProps {
  listNumber: number;
  listLanguageCode: SupportedLanguage;
}

export default function ExpandListWithCsvForm({
  listNumber,
  listLanguageCode,
}: ExpandListWithCsvFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const methods = useForm<ExpandListForm>({
    resolver: zodResolver(expandListFormSchema),
    mode: "onBlur",
    defaultValues: {
      listNumber,
    },
  });

  const { isSubmitting, isValid, isDirty } = methods.formState;

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
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
      uploadCSVFileAction(listNumber, listLanguageCode, formData),
      {
        loading: "Adding new items...",
        success: (result) => result.message ?? "This seems to have worked! 🎉",
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );

    if (response?.listNumber) {
      methods.reset();
      router.push(paths.listDetailsPath(response.listNumber));
    }
    setLoading(false);
  };

  const noCsvFile = methods.watch("csvfile")?.length === 0;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4 rounded-md bg-white/90 p-2 text-center tablet:max-h-fit tablet:max-w-[800px] tablet:p-8"
      >
        <h1 className="bg-white/80 text-center font-serif text-blue-800 tablet:text-hmd desktop:text-hlg">
          Expand this list by uploading a CSV file
        </h1>
        <div className="flex flex-col gap-2">
          <SubmitCSVFile optional={false} />
          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty || noCsvFile}
            intent="primary"
            rounded
            busy={loading}
          >
            Start upload
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
