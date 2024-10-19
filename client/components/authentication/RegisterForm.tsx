"use client";
import { createUser } from "@/lib/actions";
import { setErrorsFromBackend } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import { RegisterSchema } from "@/lib/types";
import { registerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import Spinner from "../Spinner";
import Button from "../ui/Button";
import InputWithCheck from "./InputWithCheck";
import {
  LandingPageFormContainer,
  LandingPageFormHeader,
  LandingPageInput,
} from "./LandingPageComponents";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
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
    <LandingPageFormContainer>
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
          id="password"
          placeholder="Enter your password"
        />
        <FormErrors errors={errors} field="password" />

        <LandingPageInput
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          placeholder="Enter your password again"
        />
        <FormErrors errors={errors} field="confirmPassword" />
        <FormErrors errors={errors} field="root" />

        <Button
          intent="primary"
          disabled={isSubmitting || isSubmitted}
          type="submit"
        >
          {isSubmitting ? <Spinner centered size="mini" /> : "Register"}
        </Button>
      </form>
    </LandingPageFormContainer>
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
