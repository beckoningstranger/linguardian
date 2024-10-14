"use client";
import { createUser } from "@/lib/actions";
import { setErrorsFromBackend } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import { RegisterSchema } from "@/lib/types";
import { registerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import Spinner from "../Spinner";
import InputWithCheck from "./InputWithCheck";
import {
  LandingPageContainer,
  LandingPageFormHeader,
  LandingPageInput,
} from "./LandingPageComponents";

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
    mode: "onBlur",
  });

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
      setErrorsFromBackend(response.errors, setError);
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
    <LandingPageContainer>
      <LandingPageFormHeader title="Create an account" />
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

        <LandingPageInput
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        <FormErrors errors={errors} field="password" />

        <LandingPageInput
          {...register("confirmPassword")}
          type="password"
          placeholder="Please type your password again"
        />
        <FormErrors errors={errors} field="confirmPassword" />
        <FormErrors errors={errors} field="root" />

        <button
          className="cursor-pointer bg-green-600 px-6 py-2 font-bold text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner centered size="mini" /> : "Register"}
        </button>
      </form>
    </LandingPageContainer>
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
  return <div className="ml-2 max-w-96 text-sm text-red-500">{message}</div>;
}
