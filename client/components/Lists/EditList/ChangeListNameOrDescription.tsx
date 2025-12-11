"use client";

import { Button } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import FormErrors from "@/components/Forms/FormErrors";
import StyledInput from "@/components/Forms/StyledInput";
import StyledTextArea from "@/components/Forms/StyledTextArea";
import { updateListDetailsAction } from "@/lib/actions/list-actions";
import {
  ListDetailsUpdate,
  listDetailsUpdateSchema,
  listSchema,
  SupportedLanguage,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

interface ChangeListNameOrDescriptionProps {
  name: string;
  listNumber: number;
  description?: string;
  listLanguage: SupportedLanguage;
}

export default function ChangeListNameOrDescription({
  name,
  listNumber,
  description,
  listLanguage,
}: ChangeListNameOrDescriptionProps) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<ListDetailsUpdate>({
    resolver: zodResolver(listDetailsUpdateSchema),
    defaultValues: {
      name,
      description,
    },
    mode: "onChange",
  });

  const onSubmit = async () => {
    const update: ListDetailsUpdate = {
      name: watch().name?.trim(),
      description: watch().description?.trim(),
    };

    const response = await toast.promise(
      updateListDetailsAction(update, listLanguage, listNumber),
      {
        loading: "Updating the list...",
        success: (result) => result.message,
        error: (err) => (err instanceof Error ? err.message : err.toString()),
      }
    );
    if (response) router.push(paths.listDetailsPath(listNumber));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full grow flex-col gap-1"
    >
      <div>
        <StyledInput
          {...register("name", {})}
          id="name"
          name="name"
          noFloatingLabel
          label={`Enter a name for this list`}
          className="font-serif text-hsm tablet:text-hmd"
          hasErrors={!!errors.name}
        />
        <FormErrors errors={errors} field="name" />
      </div>
      <div className="flex grow flex-col">
        <StyledTextArea
          {...register("description", {})}
          id="description"
          noFloatingLabel
          name="description"
          label={`Enter a description for this list`}
          hasErrors={!!errors.description}
          className="flex grow overflow-hidden"
        />
        <FormErrors errors={errors} field="description" />
      </div>
      {isDirty && isValid && (
        <Button
          className={cn(
            "fixed bottom-0 left-0 h-20 z-40 text-clgm w-full bg-green-400 hover:bg-green-500"
          )}
          type="submit"
        >
          <span className="text-white">Save changes</span>
        </Button>
      )}
    </form>
  );
}
