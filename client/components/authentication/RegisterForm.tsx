"use client";
import { createUser } from "@/lib/actions";
import paths from "@/lib/paths";
import { RegisterSchema } from "@/lib/types";
import { registerSchema } from "@/lib/validations";
import { Input } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { ZodFormattedError } from "zod";
import Spinner from "../Spinner";
import InputWithCheck from "./InputWithCheck";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { id: "credentials" },
  });

  const inputStyling =
    "w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40";

  const onSubmit = async ({
    username,
    email,
    password,
    confirmPassword,
  }: RegisterSchema) => {
    const response = await createUser({
      id: "credentials",
      username,
      email,
      password,
      confirmPassword,
    });

    if (!response.success) {
      const errors = response.errors as ZodFormattedError<
        RegisterSchema,
        string
      >;

      setFormErrors(setError, errors);
    } else {
      reset();
      await signIn("credentials", {
        email,
        password,
        callbackUrl: paths.welcomePath(),
      });
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="rounded-lg border-t-4 border-green-400 p-5 shadow-lg">
        <h1 className="my-4 text-xl font-bold">Create a Linguardian account</h1>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <InputWithCheck
            setValue={setValue}
            checkMode="username"
            setError={setError}
            register={register}
            watch={watch}
          />
          <FormErrors errors={errors} field="username" />

          <InputWithCheck
            setValue={setValue}
            checkMode="email"
            setError={setError}
            register={register}
            watch={watch}
          />
          <FormErrors errors={errors} field="email" />

          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={inputStyling}
          />
          <FormErrors errors={errors} field="password" />

          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Please type your password again"
            className={inputStyling}
          />
          <FormErrors errors={errors} field="confirmPassword" />
          <FormErrors errors={errors} field="root" />

          <button
            className="cursor-pointer bg-green-600 px-6 py-2 font-bold text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner centered size="mini" /> : "Register"}
          </button>

          <Link href={paths.rootPath()} className="mt-3 text-right text-sm">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

type FormErrorsProps = {
  errors: FieldErrors<FieldValues>;
  field: string;
};
function FormErrors({ errors, field }: FormErrorsProps) {
  const error = errors[field];
  const message =
    typeof error?.message === "string" ? error.message : undefined;
  return <div className="ml-2 text-sm text-red-500">{message}</div>;
}

// All credits go to ChatGPT4
function setFormErrors(
  setError: Function,
  errors: ZodFormattedError<RegisterSchema, string>
) {
  // Type guard to check if value is an object with _errors
  const hasErrors = (value: any): value is { _errors: string[] } => {
    return typeof value === "object" && value !== null && "_errors" in value;
  };

  // Iterate over each key-value pair in the errors object
  Object.entries(errors).forEach(([key, value]) => {
    if (hasErrors(value)) {
      // If value has _errors, iterate over each error message
      value._errors.forEach((message) => {
        setError(key, {
          type: "manual",
          message,
        });
      });
    } else if (Array.isArray(value)) {
      // If value is just an array of strings, handle those too
      value.forEach((message) => {
        setError(key, {
          type: "manual",
          message,
        });
      });
    }
  });
}
